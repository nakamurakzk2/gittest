'use client'

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, Plus, Trash2 } from "lucide-react"

// Entity
import { OwnProduct, OwnAssetProduct, OwnProductStatus, AdminProductStatus, ProductItem } from "@/entity/product/product"
import { Town } from "@/entity/town/town"
import { Business } from "@/entity/town/business"
import { User } from "@/entity/user/user"
import { ProductChat } from "@/entity/user/user-chat"
import { FormAnswer } from "@/entity/product/form"
import { CustomerSupportMemo } from "@/entity/admin/user"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as AdminCustomerSupportServerLogic from "@/logic/server/admin/admin-customer-support-server-logic"

// Providers
import { useDialog } from "@/providers/dialog-provider"

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

type Props = {
  ownProducts: OwnProduct[]
  ownAssetProducts: OwnAssetProduct[]
  productItems: ProductItem[]
  towns: Town[]
  businesses: Business[]
  users: User[]
  productChats: ProductChat[]
  formAnswers: FormAnswer[]
  customerSupportMemos: CustomerSupportMemo[]
  filterCondition: FilterCondition
  sortCondition: SortCondition
  onMemoUpdate: () => void
}

type PurchaserRow = {
  userId: string
  isOwner: boolean
  ownProduct: OwnProduct | null
  ownAssetProduct: OwnAssetProduct | null
  productItem: ProductItem
  town: Town
  business: Business
  purchaser: User | null
  nftHolder: User | null
  productChat: ProductChat | null
  formAnswers: FormAnswer[]
  newMessageCount: number
  newFormCount: number
  createdAt: number | null
}

export default function PurchaserListView({
  ownProducts,
  ownAssetProducts,
  productItems,
  towns,
  businesses,
  users,
  productChats,
  formAnswers,
  customerSupportMemos,
  filterCondition,
  sortCondition,
  onMemoUpdate,
}: Props) {


  const router = useRouter()
  const { onFetch } = useDialog()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [memoDialogOpen, setMemoDialogOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<{ userId: string, productId: string, tokenId: number } | null>(null)
  const [memoText, setMemoText] = useState("")


  const createPurchaserRow = (productId: string, tokenId: number, userId: string, isAssetMode: boolean): PurchaserRow | null => {
    const ownProduct = ownProducts.find(e => e.productId === productId && e.tokenId === tokenId && (isAssetMode ? e.userId !== userId : e.userId === userId))
    const ownAssetProduct = ownAssetProducts.find(e => e.productId === productId && e.tokenId === tokenId && (isAssetMode ? e.userId === userId : e.userId !== userId))
    if (ownProduct == null && ownAssetProduct == null) return null

    const townId = ownProduct?.townId || ownAssetProduct?.townId
    const businessId = ownProduct?.businessId || ownAssetProduct?.businessId

    const productItem = productItems.find(item => item.productId === productId)
    if (!productItem) return null

    const town = towns.find(e => e.townId === townId)
    const business = businesses.find(e => e.businessId === businessId)
    const purchaser = ownProduct == null ? null : users.find(e => e.userId === ownProduct.userId)
    const nftHolder = ownAssetProduct == null ? null : users.find(e => e.userId === ownAssetProduct.userId)
    const productChat = productChats.find(e => e.tokenId === tokenId && e.productId === productId && e.userId === userId)
    const targetFormAnswers = formAnswers.filter(e => e.productId === productId && e.tokenId === tokenId && e.userId === userId)
    const newMessageCount = productChat == null ? 0 : productChat.adminUnreadCount
    const newFormCount = targetFormAnswers.length > 0 ? 1 : 0
    let isOwner = false
    let createdAt = null
    if (isAssetMode) {
      isOwner = ownAssetProduct != null && ownAssetProduct.isOwner
      createdAt = ownAssetProduct?.createdAt || null
    } else {
      isOwner = ownProduct != null && (ownProduct.status === OwnProductStatus.PURCHASED || ownProduct.status === OwnProductStatus.NFT_MINTED)
      createdAt = ownProduct?.createdAt || null
    }

    return {
      userId,
      isOwner,
      ownProduct,
      ownAssetProduct,
      productItem,
      town: town!,
      business: business!,
      purchaser: purchaser || null,
      nftHolder: nftHolder || null,
      productChat: productChat || null,
      formAnswers: targetFormAnswers,
      newMessageCount,
      newFormCount,
      createdAt,
    } as PurchaserRow
  }

  // データを結合してテーブル行を作成
  const rows = useMemo(() => {
    const rows: PurchaserRow[] = []

    for (const ownProduct of ownProducts) {
      const { productId, tokenId, userId } = ownProduct
      const row = createPurchaserRow(productId, tokenId, userId, false)
      if (row == null) continue
      rows.push(row)
    }
    for (const ownAssetProduct of ownAssetProducts) {
      const { productId, tokenId, userId } = ownAssetProduct
      const row = createPurchaserRow(productId, tokenId, userId, true)
      if (row == null) continue
      rows.push(row)
    }

    // フィルタリング
    let filteredRows = rows.filter((row) => {
      // 決済日のフィルタリング
      const paymentDate = row.ownProduct?.createdAt || row.ownAssetProduct?.createdAt || 0
      if (filterCondition.paymentDateFrom) {
        const fromTimestamp = filterCondition.paymentDateFrom.getTime()
        if (paymentDate < fromTimestamp) return false
      }
      if (filterCondition.paymentDateTo) {
        const toTimestamp = filterCondition.paymentDateTo.getTime() + 24 * 60 * 60 * 1000 - 1 // その日の終わりまで
        if (paymentDate > toTimestamp) return false
      }

      // 自治体のフィルタリング
      if (filterCondition.filterTownId !== "all" && row.town.townId !== filterCondition.filterTownId) {
        return false
      }

      // 事業者のフィルタリング
      if (filterCondition.filterBusinessId !== "all" && row.business.businessId !== filterCondition.filterBusinessId) {
        return false
      }

      // 商品の種類のフィルタリング
      if (filterCondition.filterProductId !== "all" && row.productItem.productId !== filterCondition.filterProductId) {
        return false
      }

      // 商品ステータスのフィルタリング
      if (filterCondition.filterProductStatus !== "all") {
        const productStatus = row.ownProduct?.adminStatus || row.ownAssetProduct?.adminStatus
        if (productStatus !== filterCondition.filterProductStatus) {
          return false
        }
      }

      // フォームステータスのフィルタリング
      if (filterCondition.filterFormStatus !== "all") {
        const hasForm = row.formAnswers.length > 0
        if (filterCondition.filterFormStatus === "submitted" && !hasForm) {
          return false
        }
        if (filterCondition.filterFormStatus === "not_submitted" && hasForm) {
          return false
        }
      }

      return true
    })

    // ソート
    filteredRows.sort((a, b) => {
      let compareValue = 0

      switch (sortCondition.field) {
        case "paymentDate": {
          const dateA = a.createdAt || 0
          const dateB = b.createdAt || 0
          compareValue = dateA - dateB
          break
        }
        case "town": {
          const townA = a.town.name.ja
          const townB = b.town.name.ja
          compareValue = townA.localeCompare(townB, "ja")
          break
        }
        case "business": {
          const businessA = a.business.name
          const businessB = b.business.name
          compareValue = businessA.localeCompare(businessB, "ja")
          break
        }
        case "product": {
          const productA = a.productItem.title.ja
          const productB = b.productItem.title.ja
          compareValue = productA.localeCompare(productB, "ja")
          break
        }
        case "productStatus": {
          const statusA = a.ownProduct?.adminStatus || a.ownAssetProduct?.adminStatus || AdminProductStatus.CONSULTATION
          const statusB = b.ownProduct?.adminStatus || b.ownAssetProduct?.adminStatus || AdminProductStatus.CONSULTATION
          const statusOrder = [AdminProductStatus.CONSULTATION, AdminProductStatus.IN_USE, AdminProductStatus.COMPLETED]
          compareValue = statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
          break
        }
        case "formStatus": {
          const hasFormA = a.formAnswers.length > 0
          const hasFormB = b.formAnswers.length > 0
          compareValue = hasFormA === hasFormB ? 0 : hasFormA ? 1 : -1
          break
        }
      }

      return sortCondition.order === "asc" ? compareValue : -compareValue
    })

    return filteredRows
  }, [ownProducts, ownAssetProducts, productItems, towns, businesses, users, productChats, formAnswers, filterCondition, sortCondition])

  // ページネーション
  useEffect(() => {
    setCurrentPage(1)
  }, [filterCondition, sortCondition])

  const totalPages = Math.ceil(rows.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRows = rows.slice(startIndex, endIndex)

  const getNftStatusText = (row: PurchaserRow): string => {
    if (row.ownProduct) {
      switch (row.ownProduct.status) {
        case OwnProductStatus.PENDING_PAYMENT:
          return "入金待ち"
        case OwnProductStatus.PURCHASED:
          return "購入済み"
        case OwnProductStatus.NFT_MINTED:
          return "NFT発行済"
        case OwnProductStatus.NFT_TRANSFERRED:
          return "NFT転送済"
        case OwnProductStatus.CANCELED:
          return "キャンセル済み"
        default:
          return "不明"
      }
    }
    if (row.ownAssetProduct) {
      return "NFT保有者"
    }
    return "-"
  }

  const getProductStatusText = (status: AdminProductStatus): string => {
    switch (status) {
      case AdminProductStatus.CONSULTATION:
        return "相談"
      case AdminProductStatus.IN_USE:
        return "使う"
      case AdminProductStatus.COMPLETED:
        return "完了"
      default:
        return "-"
    }
  }

  const getFormStatusText = (row: PurchaserRow): string => {
    if (row.formAnswers.length === 0) {
      return "未入力"
    }
    return "送信済み"
  }

  const getUserDisplayName = (user: User | null): string => {
    if (user == null || user.billingInfo == null) return "-"
    return `${user.billingInfo.lastName} ${user.billingInfo.firstName} (${user.billingInfo.lastNameKana}${user.billingInfo.firstNameKana})`
  }

  const onClickRow = (row: PurchaserRow) => {
    if (row.ownProduct) {
      router.push(`/admin/customer-support/own-products/${row.ownProduct.productId}/${row.ownProduct.tokenId}/${row.ownProduct.userId}`)
    }
  }

  const getOwnProductUrl = (row: PurchaserRow, tab?: "status" | "chat" | "forms"): string | null => {
    const userId = row.userId
    if (row.ownProduct) {
      const url = `/admin/customer-support/own-products/${row.ownProduct.productId}/${row.ownProduct.tokenId}/${userId}`
      return tab ? `${url}?tab=${tab}` : url
    }
    if (row.ownAssetProduct) {
      const url = `/admin/customer-support/own-products/${row.ownAssetProduct.productId}/${row.ownAssetProduct.tokenId}/${userId}`
      return tab ? `${url}?tab=${tab}` : url
    }
    return null
  }

  const getChatUrl = (row: PurchaserRow, userId: string | null): string | null => {
    if (userId == null || row.userId !== userId) return null
    return getOwnProductUrl(row, "chat")
  }

  const getProductStatusUrl = (row: PurchaserRow): string | null => {
    return getOwnProductUrl(row, "status")
  }

  const getFormStatusUrl = (row: PurchaserRow): string | null => {
    return getOwnProductUrl(row, "forms")
  }

  const getMemo = (row: PurchaserRow): CustomerSupportMemo | null => {
    const userId = row.userId
    const productId = row.ownProduct?.productId || row.ownAssetProduct?.productId
    const tokenId = row.ownProduct?.tokenId || row.ownAssetProduct?.tokenId
    if (!productId || !tokenId) return null
    return customerSupportMemos.find(m => m.userId === userId && m.productId === productId && m.tokenId === tokenId) || null
  }

  const onClickMemo = (row: PurchaserRow, e: React.MouseEvent) => {
    e.stopPropagation()
    const userId = row.userId
    const productId = row.ownProduct?.productId || row.ownAssetProduct?.productId
    const tokenId = row.ownProduct?.tokenId || row.ownAssetProduct?.tokenId
    if (!productId || !tokenId) return

    const existingMemo = getMemo(row)
    setEditingMemo({ userId, productId, tokenId })
    setMemoText(existingMemo?.memo || "")
    setMemoDialogOpen(true)
  }

  const onClickSaveMemo = async () => {
    if (!editingMemo) return

    await onFetch(async () => {
      await AdminCustomerSupportServerLogic.upsertCustomerSupportMemo(
        editingMemo.userId,
        editingMemo.productId,
        editingMemo.tokenId,
        memoText
      )
      setMemoDialogOpen(false)
      setEditingMemo(null)
      setMemoText("")
      onMemoUpdate()
    })
  }

  const onClickDeleteMemo = async () => {
    if (!editingMemo) return

    await onFetch(async () => {
      await AdminCustomerSupportServerLogic.deleteCustomerSupportMemo(
        editingMemo.userId,
        editingMemo.productId,
        editingMemo.tokenId
      )
      setMemoDialogOpen(false)
      setEditingMemo(null)
      setMemoText("")
      onMemoUpdate()
    })
  }

  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold">購入者一覧</div>
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs w-32">通知</TableHead>
              <TableHead className="text-xs w-24">自治体</TableHead>
              <TableHead className="text-xs">事業者</TableHead>
              <TableHead className="text-xs">商品</TableHead>
              <TableHead className="text-xs">NFT</TableHead>
              <TableHead className="text-xs w-28">NFTｽﾃｰﾀｽ</TableHead>
              <TableHead className="text-xs w-32">購入者</TableHead>
              <TableHead className="text-xs w-32">NFT保有者</TableHead>
              <TableHead className="text-xs">入手日</TableHead>
              <TableHead className="text-xs w-24">商品ｽﾃｰﾀｽ</TableHead>
              <TableHead className="text-xs w-24">ﾌｫｰﾑｽﾃｰﾀｽ</TableHead>
              <TableHead className="text-xs w-24">備考</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((row, index) => {
              const tokenId = row.ownProduct?.tokenId || row.ownAssetProduct?.tokenId || 0

              return (
                <TableRow
                  key={index}
                  className={`cursor-pointer ${row.isOwner ? '' : 'bg-[#AAAAAA]'}`}
                  onClick={() => onClickRow(row)}
                >
                  <TableCell className="text-xs">
                    {(() => {
                      const chatUrl = getChatUrl(row, row.ownProduct?.userId || row.ownAssetProduct?.userId || null)
                      const content = (
                        <div className="flex items-center gap-1 flex-wrap">
                          {row.newMessageCount > 0 && (
                            <div className="flex items-center gap-1">
                              <span>新着メッセージ</span>
                              <Badge variant="destructive" className="h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                                {row.newMessageCount}
                              </Badge>
                            </div>
                          )}
                          {row.newMessageCount === 0 && (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      )
                      return chatUrl ? (
                        <Link href={chatUrl} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {content}
                        </Link>
                      ) : content
                    })()}
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{row.town.name.ja}</TableCell>
                  <TableCell className="text-xs">{row.business.name}</TableCell>
                  <TableCell className="text-xs truncate">{row.productItem.title.ja}</TableCell>
                  <TableCell className="text-xs">#{tokenId}</TableCell>
                  <TableCell className="text-xs">{getNftStatusText(row)}</TableCell>
                  <TableCell className="text-xs">
                    {(() => {
                      const chatUrl = row.purchaser ? getChatUrl(row, row.purchaser.userId) : null
                      const displayName = getUserDisplayName(row.purchaser)
                      return chatUrl ? (
                        <Link href={chatUrl} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {displayName}
                        </Link>
                      ) : (
                        <span>{displayName}</span>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {(() => {
                      const chatUrl = row.nftHolder ? getChatUrl(row, row.nftHolder.userId) : null
                      const displayName = getUserDisplayName(row.nftHolder)
                      return chatUrl ? (
                        <Link href={chatUrl} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {displayName}
                        </Link>
                      ) : (
                        <span>{displayName}</span>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.createdAt == null ? "-" : CommonLogic.formatDate(row.createdAt, "yyyy/MM/dd hh:mm:ss")}
                  </TableCell>
                  <TableCell className="text-xs">
                    {(() => {
                      const productStatusUrl = getProductStatusUrl(row)
                      const statusText = row.ownProduct ? getProductStatusText(row.ownProduct.adminStatus) : "-"
                      return productStatusUrl ? (
                        <Link href={productStatusUrl} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {statusText}
                        </Link>
                      ) : (
                        <span>{statusText}</span>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {(() => {
                      const formStatusUrl = getFormStatusUrl(row)
                      const statusText = getFormStatusText(row)
                      return formStatusUrl ? (
                        <Link href={formStatusUrl} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {statusText}
                        </Link>
                      ) : (
                        <span>{statusText}</span>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {(() => {
                      const memo = getMemo(row)
                      return (
                        <div
                          onClick={(e) => onClickMemo(row, e)}
                          className="flex items-center justify-center cursor-pointer hover:opacity-70"
                        >
                          {memo ? (
                            <FileText className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Plus className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      )
                    })()}
                  </TableCell>
                </TableRow>
              )
            })}
            {currentRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ページネーション */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {rows.length > 0 ? (
            <>
              全{rows.length}件中 {startIndex + 1}件目～{Math.min(endIndex, rows.length)}件目を表示
            </>
          ) : (
            "データがありません"
          )}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* メモ編集Dialog */}
      <Dialog open={memoDialogOpen} onOpenChange={setMemoDialogOpen}>
        <DialogContent
          className="max-w-2xl"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>顧客サポートメモ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="メモを入力してください"
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter className="flex justify-between">
            <div>
              {editingMemo && customerSupportMemos.find(m =>
                m.userId === editingMemo.userId &&
                m.productId === editingMemo.productId &&
                m.tokenId === editingMemo.tokenId
              ) && (
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickDeleteMemo()
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setMemoDialogOpen(false)
                  setEditingMemo(null)
                  setMemoText("")
                }}
              >
                キャンセル
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onClickSaveMemo()
                }}
              >
                保存
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

