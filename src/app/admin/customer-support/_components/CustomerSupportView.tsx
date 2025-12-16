'use client'

import { useEffect, useState, useMemo } from "react"
import { X } from "lucide-react"
import { DateRange } from "react-day-picker"

// Entity
import { ProductItem, AdminProductStatus } from "@/entity/product/product"
import { Town } from "@/entity/town/town"
import { Business } from "@/entity/town/business"
import { User } from "@/entity/user/user"
import { OwnProduct, OwnAssetProduct } from "@/entity/product/product"
import { ProductChat, PreTalkChat } from "@/entity/user/user-chat"
import { FormAnswer } from "@/entity/product/form"
import { CustomerSupportMemo } from "@/entity/admin/user"

// Components
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PurchaserListView from "./PurchaserListView"
import PreTalkChatListView from "./PreTalkChatListView"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as AdminCustomerSupportServerLogic from "@/logic/server/admin/admin-customer-support-server-logic"

type Props = {
  townId: string
  businessId: string
}

type FilterCondition = {
  paymentDateFrom: Date | undefined
  paymentDateTo: Date | undefined
  filterTownId: string | "all"
  filterBusinessId: string | "all"
  filterProductId: string | "all"
  filterProductStatus: AdminProductStatus | "all"
  filterFormStatus: "all" | "submitted" | "not_submitted"
}

type SortCondition = {
  field: "paymentDate" | "town" | "business" | "product" | "productStatus" | "formStatus"
  order: "asc" | "desc"
}

export default function CustomerSupportView({ townId, businessId }: Props) {
  const { onFetch } = useDialog()

  const [towns, setTowns] = useState<Town[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [productItems, setProductItems] = useState<ProductItem[]>([])
  const [ownProducts, setOwnProducts] = useState<OwnProduct[]>([])
  const [ownAssetProducts, setOwnAssetProducts] = useState<OwnAssetProduct[]>([])
  const [productChats, setProductChats] = useState<ProductChat[]>([])
  const [preTalkChats, setPreTalkChats] = useState<PreTalkChat[]>([])
  const [formAnswers, setFormAnswers] = useState<FormAnswer[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [customerSupportMemos, setCustomerSupportMemos] = useState<CustomerSupportMemo[]>([])

  const [filterCondition, setFilterCondition] = useState<FilterCondition>({
    paymentDateFrom: undefined,
    paymentDateTo: undefined,
    filterTownId: "all",
    filterBusinessId: "all",
    filterProductId: "all",
    filterProductStatus: "all",
    filterFormStatus: "all",
  })

  const [sortCondition, setSortCondition] = useState<SortCondition>({
    field: "paymentDate",
    order: "desc",
  })

  const reload = async () => {
    await onFetch(async () => {
      const data = await AdminCustomerSupportServerLogic.fetchCustomerSupportData(townId, businessId)
      setTowns(data.towns)
      setBusinesses(data.businesses)
      setProductItems(data.productItems)
      setOwnProducts(data.ownProducts)
      setOwnAssetProducts(data.ownAssetProducts)
      setProductChats(data.productChats)
      setPreTalkChats(data.preTalkChats)
      setFormAnswers(data.formAnswers)
      setUsers(data.users)
    })
    await onFetch(async () => {
      const memosData = await AdminCustomerSupportServerLogic.fetchCustomerSupportMemos()
      setCustomerSupportMemos(memosData.customerSupportMemos)
    })
  }

  useEffect(() => {
    reload()
  }, [townId, businessId])

  const onClickClear = () => {
    setFilterCondition({
      paymentDateFrom: undefined,
      paymentDateTo: undefined,
      filterTownId: "all",
      filterBusinessId: "all",
      filterProductId: "all",
      filterProductStatus: "all",
      filterFormStatus: "all",
    })
    setSortCondition({
      field: "paymentDate",
      order: "desc",
    })
  }

  const onPaymentDateRangeChange = (range: DateRange) => {
    setFilterCondition(prev => ({
      ...prev,
      paymentDateFrom: range.from,
      paymentDateTo: range.to,
    }))
  }

  const paymentDateRange: DateRange = useMemo(() => ({
    from: filterCondition.paymentDateFrom,
    to: filterCondition.paymentDateTo,
  }), [filterCondition.paymentDateFrom, filterCondition.paymentDateTo])

  const availableTowns = useMemo(() => {
    if (townId) return []
    return towns
  }, [towns, townId])

  const availableBusinesses = useMemo(() => {
    if (businessId) return []
    return businesses
  }, [businesses, businessId])

  return (
    <div className="space-y-4">
      {/* 検索条件 */}
      <Card>
        <CardHeader>
          <CardTitle>検索条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 決済日 */}
            <div className="space-y-2">
              <Label>決済日</Label>
              <CalendarDateRangePicker
                value={paymentDateRange}
                onChange={onPaymentDateRangeChange}
              />
            </div>

            {/* 自治体 */}
            {availableTowns.length > 0 && (
              <div className="space-y-2">
                <Label>自治体</Label>
                <Select
                  value={filterCondition.filterTownId}
                  onValueChange={(value) => setFilterCondition(prev => ({ ...prev, filterTownId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {availableTowns.map((town) => (
                      <SelectItem key={town.townId} value={town.townId}>
                        {town.name.ja}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 事業者 */}
            {availableBusinesses.length > 0 && (
              <div className="space-y-2">
                <Label>事業者</Label>
                <Select
                  value={filterCondition.filterBusinessId}
                  onValueChange={(value) => setFilterCondition(prev => ({ ...prev, filterBusinessId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {availableBusinesses.map((business) => (
                      <SelectItem key={business.businessId} value={business.businessId}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 商品の種類 */}
            <div className="space-y-2">
              <Label>商品の種類</Label>
              <Select
                value={filterCondition.filterProductId}
                onValueChange={(value) => setFilterCondition(prev => ({ ...prev, filterProductId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {productItems.map((item) => (
                    <SelectItem key={item.productId} value={item.productId}>
                      {item.title.ja}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 商品ステータス */}
            <div className="space-y-2">
              <Label>商品ステータス</Label>
              <Select
                value={filterCondition.filterProductStatus}
                onValueChange={(value) => setFilterCondition(prev => ({ ...prev, filterProductStatus: value as AdminProductStatus | "all" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value={AdminProductStatus.CONSULTATION}>相談</SelectItem>
                  <SelectItem value={AdminProductStatus.IN_USE}>使う</SelectItem>
                  <SelectItem value={AdminProductStatus.COMPLETED}>完了</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* フォームステータス */}
            <div className="space-y-2">
              <Label>フォームステータス</Label>
              <Select
                value={filterCondition.filterFormStatus}
                onValueChange={(value) => setFilterCondition(prev => ({ ...prev, filterFormStatus: value as "all" | "submitted" | "not_submitted" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="submitted">送信済み</SelectItem>
                  <SelectItem value="not_submitted">未入力</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 並び順 */}
            <div className="space-y-2">
              <Label>並び順</Label>
              <div className="flex gap-2">
                <Select
                  value={sortCondition.field}
                  onValueChange={(value) => setSortCondition(prev => ({ ...prev, field: value as SortCondition["field"] }))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paymentDate">入手日</SelectItem>
                    <SelectItem value="town">自治体</SelectItem>
                    <SelectItem value="business">事業者</SelectItem>
                    <SelectItem value="product">商品</SelectItem>
                    <SelectItem value="productStatus">商品ステータス</SelectItem>
                    <SelectItem value="formStatus">フォームステータス</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortCondition.order}
                  onValueChange={(value) => setSortCondition(prev => ({ ...prev, order: value as "asc" | "desc" }))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">昇順</SelectItem>
                    <SelectItem value="desc">降順</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* クリアボタン */}
          <div className="flex items-center gap-2 mt-4">
            <Button onClick={onClickClear} variant="outline" className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300">
              <X className="h-4 w-4 mr-2" />
              クリア
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 購入者一覧テーブル */}
      <PurchaserListView
        ownProducts={ownProducts}
        ownAssetProducts={ownAssetProducts}
        productItems={productItems}
        towns={towns}
        businesses={businesses}
        users={users}
        productChats={productChats}
        formAnswers={formAnswers}
        customerSupportMemos={customerSupportMemos}
        filterCondition={filterCondition}
        sortCondition={sortCondition}
        onMemoUpdate={reload}
      />

      {/* 事前相談テーブル */}
      <PreTalkChatListView
        preTalkChats={preTalkChats}
        productItems={productItems}
        towns={towns}
        businesses={businesses}
        users={users}
      />
    </div>
  )
}

