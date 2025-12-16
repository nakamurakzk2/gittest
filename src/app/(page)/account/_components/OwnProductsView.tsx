"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

// Components
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import BlueButton from "@/components/BlueButton"
import TransferConfirmDialog from "@/components/dialog/TransferConfirmDialog"

// Providers
import { useLanguageSession } from "@/providers/language-provider"
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Define
import { LANGUAGE_LIST } from "@/define/language"

// Entity
import { SimpleOwnProduct, OwnProductStatus } from "@/entity/product/product"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as UserProductPageServerLogic from "@/logic/server/user/user-product-page-server-logic"

export default function OwnProductsView() {
  const { onFetch } = useDialog()
  const { getLocalizedText } = useLanguageSession()
  const router = useRouter()

  const [ownProducts, setOwnProducts] = useState<SimpleOwnProduct[]>([])
  const [transferAddresses, setTransferAddresses] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 転送確認ダイアログの状態
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<SimpleOwnProduct | null>(null)

  /**
   * 再読み込み
   */
  const reload = async () => {
    await onFetch(async () => {
      const { simpleOwnProducts, transferAddress } = await UserProductPageServerLogic.fetchOwnProductsPage()
      setOwnProducts(simpleOwnProducts.sort((a, b) => b.createdAt - a.createdAt))
      setTransferAddresses(transferAddress)
      setCurrentPage(1) // リロード時は最初のページに戻る
    })
  }

  useEffect(() => {
    reload()
  }, [])

  // ページネーション用の計算
  const totalPages = Math.ceil(ownProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = ownProducts.slice(startIndex, endIndex)

  const getStatusBadge = (status: OwnProductStatus) => {
    switch (status) {
      case OwnProductStatus.PENDING_PAYMENT:
        return <Badge variant="secondary">{getLocalizedText(LANGUAGE_LIST.PendingPayment)}</Badge>
      case OwnProductStatus.PURCHASED:
        return <Badge variant="default">{getLocalizedText(LANGUAGE_LIST.Purchased)}</Badge>
      case OwnProductStatus.NFT_MINTED:
        return <Badge variant="default">{getLocalizedText(LANGUAGE_LIST.NftMinted)}</Badge>
      case OwnProductStatus.NFT_TRANSFERRED:
        return <Badge variant="outline">{getLocalizedText(LANGUAGE_LIST.Transferred)}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatus = (status: OwnProductStatus) => {
    switch (status) {
      case OwnProductStatus.PENDING_PAYMENT:
        return getLocalizedText(LANGUAGE_LIST.PaymentStatusUnpaid)
      case OwnProductStatus.PURCHASED:
      case OwnProductStatus.NFT_MINTED:
      case OwnProductStatus.NFT_TRANSFERRED:
        return getLocalizedText(LANGUAGE_LIST.PaymentStatusPaid)
      default:
        return getLocalizedText(LANGUAGE_LIST.PaymentStatusUnknown)
    }
  }

  const getWalletStatus = (status: OwnProductStatus) => {
    switch (status) {
      case OwnProductStatus.PENDING_PAYMENT:
        return getLocalizedText(LANGUAGE_LIST.PaymentStatusUnpaid)
      case OwnProductStatus.PURCHASED:
        return getLocalizedText(LANGUAGE_LIST.WalletNotTransferred)
      case OwnProductStatus.NFT_MINTED:
        return getLocalizedText(LANGUAGE_LIST.HeldInWallet)
      case OwnProductStatus.NFT_TRANSFERRED:
        return getLocalizedText(LANGUAGE_LIST.NotOwned)
      default:
        return getLocalizedText(LANGUAGE_LIST.PaymentStatusUnknown)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const onClickProduct = (product: SimpleOwnProduct) => {
    if (product.status === OwnProductStatus.PENDING_PAYMENT) {
      return
    }
    router.push(`/account/products/${product.productId}/${product.tokenId}`)
  }


  /**
   * 支払状況を確認する
   */
  const onClickCheckPayment = async (product: SimpleOwnProduct) => {
    await onFetch(async () => {
      await UserProductPageServerLogic.fetchPaymentStatus(product.productId, product.tokenId)
      toast({
        description: getLocalizedText(LANGUAGE_LIST.CheckPaymentStatus),
      })
      reload()
    })
  }

  /**
   * NFTを送付するボタン押下時
   */
  const onClickTransfer = (product: SimpleOwnProduct) => {
    setSelectedProduct(product)
    setIsTransferDialogOpen(true)
  }

  /**
   * 転送確認ダイアログを閉じる
   */
  const onCloseTransferDialog = () => {
    setIsTransferDialogOpen(false)
    setSelectedProduct(null)
  }

  /**
   * NFTを送付する
   */
  const onConfirmTransfer = async () => {
    if (!selectedProduct) return
    await onFetch(async () => {
      const { message} = await UserProductPageServerLogic.transferAsset(selectedProduct.productId, selectedProduct.tokenId)
      toast({
        description: message || getLocalizedText(LANGUAGE_LIST.NftTransferredSuccess),
      })
      reload()
    })
    onCloseTransferDialog()
  }

  if (ownProducts.length === 0) {
    return (
      <div className="w-full">
        <div className="text-xl">{getLocalizedText(LANGUAGE_LIST.OwnedItems)}</div>
        <div className="text-center py-8 text-gray-500">
          {getLocalizedText(LANGUAGE_LIST.NoOwnedProducts)}
        </div>
      </div>
    )
  }

  // ページネーションコンポーネント
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5

    // 表示するページ番号を計算
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl">{getLocalizedText(LANGUAGE_LIST.OwnedItems)} ({ownProducts.length}件)</div>
        <Button variant="outline" onClick={reload}>
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* ページ情報表示 */}
      {ownProducts.length > 0 && (
        <div className="text-sm text-gray-600 mb-4">
          {(() => {
            const rangeText = getLocalizedText(LANGUAGE_LIST.ItemsRangeFormat)
            const start = startIndex + 1
            const end = Math.min(endIndex, ownProducts.length)
            const total = ownProducts.length
            return rangeText
              .replace('x', String(start))
              .replace('x', String(end))
              .replace('x', String(total))
          })()}
        </div>
      )}

      {/* デスクトップ表示 */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getLocalizedText(LANGUAGE_LIST.Order)}</TableHead>
              <TableHead>{getLocalizedText(LANGUAGE_LIST.Date)}</TableHead>
              <TableHead>{getLocalizedText(LANGUAGE_LIST.Payment)}</TableHead>
              {transferAddresses && (
                <TableHead>{getLocalizedText(LANGUAGE_LIST.Status)}</TableHead>
              )}
              <TableHead>{getLocalizedText(LANGUAGE_LIST.Action)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow
                key={`${product.productGroupId}-${product.productId}-${product.tokenId}`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {product.image.length > 0 ? (
                        <Image
                          src={product.image}
                          alt={getLocalizedText(product.title)}
                          width={48}
                          height={48}
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">{getLocalizedText(LANGUAGE_LIST.NoImage)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">#{product.tokenId}</div>
                      <div className="text-xs text-gray-600 line-clamp-1">
                        {getLocalizedText(product.title)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  {CommonLogic.formatDate(product.createdAt, "yyyy年MM月dd日")}
                </TableCell>
                <TableCell className="text-xs">
                  {getPaymentStatus(product.status)}
                </TableCell>
                {transferAddresses && (
                  <TableCell className="text-xs">
                    {getWalletStatus(product.status)}
                  </TableCell>
                )}
                <TableCell className="text-xs flex flex-col items-center justify-center gap-2">
                  {(product.status === OwnProductStatus.NFT_MINTED || product.status === OwnProductStatus.PURCHASED) && (
                    <BlueButton className="text-xs" onClick={() => onClickProduct(product)}>
                      {getLocalizedText(LANGUAGE_LIST.StartUsingProduct)}
                    </BlueButton>
                  )}
                  {product.status === OwnProductStatus.NFT_TRANSFERRED && (
                    <BlueButton className="text-xs" onClick={() => onClickProduct(product)}>
                      {getLocalizedText(LANGUAGE_LIST.ViewPastMessages)}
                    </BlueButton>
                  )}
                  {product.status === OwnProductStatus.PENDING_PAYMENT && (
                    <BlueButton className="text-xs" onClick={() => onClickCheckPayment(product)}>
                      {getLocalizedText(LANGUAGE_LIST.CheckPaymentStatus)}
                    </BlueButton>
                  )}
                  {transferAddresses && product.status === OwnProductStatus.PURCHASED && (
                    <BlueButton className="text-xs" onClick={() => onClickTransfer(product)}>
                      {getLocalizedText(LANGUAGE_LIST.TransferNFT)}
                    </BlueButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* モバイル表示 */}
      <div className="md:hidden space-y-4">
        {currentProducts.map((product) => (
          <div
            key={`${product.productGroupId}-${product.productId}-${product.tokenId}`}
            className="border rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {product.image.length > 0 ? (
                  <Image
                    src={product.image}
                    alt={getLocalizedText(product.title)}
                    width={64}
                    height={64}
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">画像なし</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-lg">#{product.tokenId}</div>
                <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {getLocalizedText(product.title)}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{getLocalizedText(LANGUAGE_LIST.Date)}:</span>
                    <span>{CommonLogic.formatDate(product.createdAt, "yyyy年MM月dd日")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{getLocalizedText(LANGUAGE_LIST.Payment)}:</span>
                    <span>{getPaymentStatus(product.status)}</span>
                  </div>
                  {transferAddresses && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{getLocalizedText(LANGUAGE_LIST.Status)}:</span>
                      <span>{getWalletStatus(product.status)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  {(product.status === OwnProductStatus.NFT_MINTED || product.status === OwnProductStatus.PURCHASED) && (
                    <BlueButton className="text-xs w-full" onClick={() => onClickProduct(product)}>
                      {getLocalizedText(LANGUAGE_LIST.StartUsingProduct)}
                    </BlueButton>
                  )}
                  {product.status === OwnProductStatus.NFT_TRANSFERRED && (
                    <BlueButton className="text-xs w-full" onClick={() => onClickProduct(product)}>
                      {getLocalizedText(LANGUAGE_LIST.ViewPastMessages)}
                    </BlueButton>
                  )}
                  {product.status === OwnProductStatus.PENDING_PAYMENT && (
                    <BlueButton className="text-xs w-full" onClick={() => onClickCheckPayment(product)}>
                      {getLocalizedText(LANGUAGE_LIST.CheckPaymentStatus)}
                    </BlueButton>
                  )}
                  {transferAddresses && product.status === OwnProductStatus.PURCHASED && (
                    <BlueButton className="text-xs w-full" onClick={() => onClickTransfer(product)}>
                      {getLocalizedText(LANGUAGE_LIST.TransferNFT)}
                    </BlueButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      <div className="mt-6 flex justify-center">
        {renderPagination()}
      </div>

      {/* 転送確認ダイアログ */}
      <TransferConfirmDialog
        isOpen={isTransferDialogOpen}
        onClose={onCloseTransferDialog}
        onConfirm={onConfirmTransfer}
        product={selectedProduct}
        transferAddress={transferAddresses}
      />
    </div>
  )
}
