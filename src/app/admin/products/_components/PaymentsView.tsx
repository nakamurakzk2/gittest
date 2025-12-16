"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { startOfMonth, endOfMonth, startOfDay, endOfDay, isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import { Download } from "lucide-react"

// Entity
import { ProductPendingPayment, ProductPendingPaymentStatus } from "@/entity/product/payment"
import { ProductItem } from "@/entity/product/product"
import { Town } from "@/entity/town/town"
import { Business } from "@/entity/town/business"


// Components
import { Button } from "@/components/ui/button"
import { useDialog } from "@/providers/dialog-provider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"

// Logic
import * as AdminPaymentServerLogic from "@/logic/server/admin/admin-payment-server-logic"


type Props = {
  townId: string
  businessId: string
}

export default function PaymentsView({ townId, businessId }: Props) {
  const { onFetch } = useDialog()
  const router = useRouter()

  const [pendingPayments, setPendingPayments] = useState<ProductPendingPayment[]>([])
  const [productItems, setProductItems] = useState<ProductItem[]>([])
  const [towns, setTowns] = useState<Town[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])

  // Filter State
  const [filterType, setFilterType] = useState<'all' | 'month' | 'day' | 'custom'>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const reload = async () => {
    await onFetch(async () => {
      const { pendingPayments, productItems, towns, businesses } = await AdminPaymentServerLogic.fetchPendingPayments(townId, businessId)
      setPendingPayments(pendingPayments)
      setProductItems(productItems)
      setTowns(towns)
      setBusinesses(businesses)
      console.log(pendingPayments)
      console.log(productItems)
      console.log(towns)
      console.log(businesses)
    })
  }

  useEffect(() => {
    reload()
  }, [townId, businessId])

  // Aggregation Logic
  const aggregatedData = useMemo(() => {
    const now = new Date()

    const filteredPayments = pendingPayments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)

      if (filterType === 'month') {
        const start = startOfMonth(now)
        const end = endOfMonth(now)
        return isWithinInterval(paymentDate, { start, end })
      }
      if (filterType === 'day') {
        const start = startOfDay(now)
        const end = endOfDay(now)
        return isWithinInterval(paymentDate, { start, end })
      }
      if (filterType === 'custom' && dateRange?.from && dateRange?.to) {
        return isWithinInterval(paymentDate, { start: dateRange.from, end: dateRange.to })
      }
      return true
    })

    const grouped = new Map<string, {
      productItem: ProductItem
      totalSales: number
      orderCount: number
      cancelCount: number
    }>()

    filteredPayments.forEach(payment => {
      const productItem = productItems.find(e => e.productId === payment.productId)
      if (productItem == null) return
      const current = grouped.get(payment.productId) || {
        productItem,
        totalSales: 0,
        orderCount: 0,
        cancelCount: 0
      }

      if (payment.status === ProductPendingPaymentStatus.CANCELED) {
        current.cancelCount += payment.amount
      } else {
        current.totalSales += payment.amount * productItem.price
        current.orderCount += payment.amount
      }

      grouped.set(payment.productId, current)
    })

    return Array.from(grouped.values()).map(item => {
      const town = towns.find(t => t.townId === item.productItem.townId)
      const business = businesses.find(b => b.businessId === item.productItem.businessId)
      return {
        ...item,
        townName: town?.name.ja || '',
        businessName: business?.name || '',
        productName: item.productItem.title.ja || '',
        price: item.productItem.price || 0,
        stock: item.productItem.stock || 0,
        productGroupId: item.productItem.productGroupId,
        cancelCount: item.cancelCount,
      }
    })
  }, [pendingPayments, productItems, towns, businesses, filterType, dateRange])

  const handleDownloadCSV = () => {
    const headers = ["自治体", "事業者", "商品名", "売上合計", "販売価格", "注文数", "キャンセル数", "在庫(残)", "在庫(総数)"]
    const rows = aggregatedData.map(row => [
      row.townName,
      row.businessName,
      row.productName,
      row.totalSales,
      row.price,
      row.orderCount,
      row.cancelCount,
      row.stock - row.orderCount - row.cancelCount,
      row.stock
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
    const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `sales_data_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 w-full">
        <Button
          variant={filterType === 'all' ? "default" : "outline"}
          onClick={() => {
            setFilterType('all')
            setDateRange(undefined)
          }}
          className="w-24"
        >
          全期間
        </Button>
        <Button
          variant={filterType === 'month' ? "default" : "outline"}
          onClick={() => {
            setFilterType('month')
            const now = new Date()
            setDateRange({ from: startOfMonth(now), to: endOfMonth(now) })
          }}
          className="w-24"
        >
          月間
        </Button>
        <Button
          variant={filterType === 'day' ? "default" : "outline"}
          onClick={() => {
            setFilterType('day')
            const now = new Date()
            setDateRange({ from: startOfDay(now), to: endOfDay(now) })
          }}
          className="w-24"
        >
          日間
        </Button>
        <div className={cn("transition-all duration-200", filterType === 'custom' ? "opacity-100" : "opacity-50")}>
          <CalendarDateRangePicker
            value={dateRange || { from: undefined, to: undefined }}
            onChange={(range) => {
              setDateRange(range)
              setFilterType('custom')
            }}
            className="w-[300px]"
          />
        </div>
        <Button onClick={handleDownloadCSV} variant="outline" className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          CSV出力
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">自治体</TableHead>
              <TableHead className="w-[150px]">事業者</TableHead>
              <TableHead className="min-w-[300px]">商品名</TableHead>
              <TableHead className="w-[120px]">売上合計 (円)</TableHead>
              <TableHead className="w-[120px]">販売価格 (円)</TableHead>
              <TableHead className="w-[100px]">注文数(個)</TableHead>
              <TableHead className="w-[100px]">キャンセル数</TableHead>
              <TableHead className="w-[100px]">在庫(個)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aggregatedData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.townName}</TableCell>
                <TableCell>{row.businessName}</TableCell>
                <TableCell>
                  <span
                    className="cursor-pointer hover:underline text-primary font-medium"
                    onClick={() => router.push(`/admin/products/${row.productGroupId}/edit`)}
                  >
                    {row.productName}
                  </span>
                </TableCell>
                <TableCell>{row.totalSales.toLocaleString()}</TableCell>
                <TableCell>{row.price.toLocaleString()}</TableCell>
                <TableCell>{row.orderCount}</TableCell>
                <TableCell>{row.cancelCount}</TableCell>
                <TableCell>
                  <div className="flex items-baseline">
                    <span className={cn(
                      "text-lg font-bold",
                      (row.stock - row.orderCount - row.cancelCount) <= 0 ? "text-red-500" :
                        row.orderCount === 0 ? "text-green-600" : "text-foreground"
                    )}>
                      {row.stock - row.orderCount - row.cancelCount}
                    </span>
                    <span className="mx-1 text-sm text-muted-foreground">/</span>
                    <span className="text-sm text-muted-foreground">{row.stock}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {aggregatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
