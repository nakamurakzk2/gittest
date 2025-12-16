'use client'

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Entity
import { ProductItem } from "@/entity/product/product"
import { Town } from "@/entity/town/town"
import { Business } from "@/entity/town/business"
import { User } from "@/entity/user/user"
import { PreTalkChat } from "@/entity/user/user-chat"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type Props = {
  preTalkChats: PreTalkChat[]
  productItems: ProductItem[]
  towns: Town[]
  businesses: Business[]
  users: User[]
}

type PreTalkChatRow = {
  preTalkChat: PreTalkChat
  productItem: ProductItem
  town: Town
  business: Business
  consultant: User | null
  newMessageCount: number
}

export default function PreTalkChatListView({
  preTalkChats,
  productItems,
  towns,
  businesses,
  users,
}: Props) {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // データを結合してテーブル行を作成
  const rows = useMemo(() => {
    const rows: PreTalkChatRow[] = []

    for (const preTalkChat of preTalkChats) {
      const productItem = productItems.find(item => item.productId === preTalkChat.productId)
      if (!productItem) continue

      const town = towns.find(t => t.townId === preTalkChat.townId)
      const business = businesses.find(b => b.businessId === preTalkChat.businessId)
      const consultant = users.find(u => u.userId === preTalkChat.userId)

      rows.push({
        preTalkChat,
        productItem,
        town: town!,
        business: business!,
        consultant: consultant || null,
        newMessageCount: preTalkChat.adminUnreadCount || 0,
      })
    }

    // 更新日時の降順でソート
    return rows.sort((a, b) => {
      return b.preTalkChat.updatedAt - a.preTalkChat.updatedAt
    })
  }, [preTalkChats, productItems, towns, businesses, users])

  // ページネーション
  const totalPages = Math.ceil(rows.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRows = rows.slice(startIndex, endIndex)

  const getUserDisplayName = (user: User | null): string => {
    if (!user) return "-"
    return `${user.billingInfo.lastName} ${user.billingInfo.firstName} (${user.billingInfo.lastNameKana}${user.billingInfo.firstNameKana})`
  }

  const onClickRow = (row: PreTalkChatRow) => {
    router.push(`/admin/customer-support/pre-talk-chat/${row.preTalkChat.chatId}`)
  }

  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold">事前相談</div>
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">通知</TableHead>
              <TableHead className="text-xs">自治体</TableHead>
              <TableHead className="text-xs">事業者</TableHead>
              <TableHead className="text-xs">商品</TableHead>
              <TableHead className="text-xs">相談者</TableHead>
              <TableHead className="text-xs">備考</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((row, index) => {
              return (
                <TableRow
                  key={index}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onClickRow(row)}
                >
                  <TableCell className="text-xs">
                    {(() => {
                      const chatUrl = `/admin/customer-support/pre-talk-chat/${row.preTalkChat.chatId}`
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
                      return (
                        <Link href={chatUrl} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {content}
                        </Link>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="text-xs">{row.town.name.ja}</TableCell>
                  <TableCell className="text-xs">{row.business.name}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate">{row.productItem.title.ja}</TableCell>
                  <TableCell className="text-xs">{getUserDisplayName(row.consultant)}</TableCell>
                  <TableCell className="text-xs"></TableCell>
                </TableRow>
              )
            })}
            {currentRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
    </div>
  )
}

