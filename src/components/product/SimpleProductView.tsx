'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import Image from "next/image"

// Entity
import { SimpleBusiness } from "@/entity/town/business"
import { SimpleProductItem, SimpleProductGroup, SimpleProductCategory } from "@/entity/product/product"
import { SimpleTown } from "@/entity/town/town"

// Components
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Checkbox } from "@/components/ui/checkbox"
import QuantitySelector from "@/components/product/QuantitySelector"
import ThumbnailImageView from "@/components/common/ThumbnailImageView"
import ProductDetailCollapsible from "@/components/product/ProductDetailCollapsible"
import ReturnPolicyNotice from "@/components/product/ReturnPolicyNotice"
import BlueButton from "@/components/BlueButton"
import RedButton from "@/components/RedButton"

// Providers
import { useLanguageSession } from "@/providers/language-provider"
import { useDialog } from "@/providers/dialog-provider"

// Define
import { LANGUAGE_LIST } from "@/define/language"
import { useUserSession } from "@/providers/user-session-provider"

// Logic
import * as LocalStorageLogic from "@/logic/local-storage-logic"
import * as UserProductPageServerLogic from "@/logic/server/user/user-product-page-server-logic"

interface SimpleProductViewProps {
  productGroup: SimpleProductGroup
  productItems: SimpleProductItem[]
  productCategories: SimpleProductCategory[]
  town: SimpleTown
  business: SimpleBusiness
  defaultProductId?: string
  isPreview?: boolean
}

export default function SimpleProductView({ productGroup, productItems, productCategories, town, business, defaultProductId, isPreview = false }: SimpleProductViewProps) {
  const { getLocalizedText } = useLanguageSession()
  const { onFetch } = useDialog()
  const { simpleUser } = useUserSession()
  const router = useRouter()

  // defaultProductIdが指定されている場合、その商品のインデックスを初期値として設定
  const getInitialVariationIndex = () => {
    if (defaultProductId) {
      const index = productItems.findIndex(item => item.productId === defaultProductId)
      return index !== -1 ? index : 0
    }
    return 0
  }

  const [selectedVariation, setSelectedVariation] = useState(getInitialVariationIndex())
  const [amount, setAmount] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [reachedUserLimit, setReachedUserLimit] = useState(false)
  const [checkedConfirmations, setCheckedConfirmations] = useState<boolean[]>([])

  const currentProduct = productItems[selectedVariation]
  const maxQuantity = currentProduct?.buyLimit || currentProduct?.stock || 999

  // 購入確認項目の初期化
  useEffect(() => {
    if (currentProduct?.purchaseConfirmations && currentProduct.purchaseConfirmations.length > 0) {
      setCheckedConfirmations(new Array(currentProduct.purchaseConfirmations.length).fill(false))
    } else {
      setCheckedConfirmations([])
    }
  }, [currentProduct?.purchaseConfirmations, currentProduct?.productId])

  // すべてのチェックが入っているか確認
  const allConfirmationsChecked = currentProduct?.purchaseConfirmations
    ? checkedConfirmations.length === currentProduct.purchaseConfirmations.length &&
      checkedConfirmations.every(checked => checked)
    : true

  /**
   * リロード
   */
  const reload = async () => {
    if (simpleUser == null) return
    await onFetch(async () => {
      const { reachedUserLimit, count } = await UserProductPageServerLogic.fetchOwnCount(currentProduct.productId)
      setReachedUserLimit(reachedUserLimit)
    })
  }

  useEffect(() => {
    reload()
  }, [currentProduct.productId, simpleUser])

  const onClickPurchase = () => {
    const purchaseUrl = `/product/payment?productId=${currentProduct.productId}&amount=${amount}`
    if (simpleUser) {
      router.push(purchaseUrl)
    } else {
      LocalStorageLogic.saveCallbackUrl(purchaseUrl)
      router.push('/login')
    }
  }

  const onClickPreConsultation = () => {
    const chatUrl = `/product/${productGroup.productGroupId}/chat?productId=${currentProduct.productId}`
    if (simpleUser) {
      router.push(chatUrl)
    } else {
      LocalStorageLogic.saveCallbackUrl(chatUrl)
      router.push('/login')
    }
  }

  /**
   * 現在選択中の商品アイテムのカテゴリ
   */
  const currentCategories = useMemo(() => {
    return productCategories.filter((category) => currentProduct.categoryIds.includes(category.categoryId))
  }, [currentProduct, productCategories])


  if (!currentProduct) {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* プレビュー表示バナー */}
      {isPreview && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-yellow-400" />
            <div className="ml-1">
              <p className="text-sm text-yellow-700">
                この商品は現在プレビューモードで表示されています
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 商品画像エリア */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: '#CCCCCC' }}>
            {currentProduct.images && currentProduct.images.length > 0 ? (
              <Image
                src={currentProduct.images[selectedImageIndex]}
                alt={getLocalizedText(currentProduct.title)}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                  <Image
                    src="/placeholder-image.png"
                    alt={getLocalizedText(LANGUAGE_LIST.ProductImage)}
                    width={64}
                    height={64}
                    className="opacity-50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* サムネイル画像 */}
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentProduct.images.map((image, index) => (
                <ThumbnailImageView
                  key={index}
                  imageSrc={image}
                  imageAlt={`${getLocalizedText(LANGUAGE_LIST.Thumbnail)} ${index + 1}`}
                  isSelected={selectedImageIndex === index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{ backgroundColor: '#CCCCCC' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 商品情報エリア */}
        <div className="space-y-6">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {getLocalizedText(town.name)}
            </Badge>
            {/* カテゴリ */}
            {currentCategories.length > 0 && (<>
              <span>/</span>
              {currentCategories.map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {getLocalizedText(category.name)}
                </Badge>
              ))}
            </>)}
          </div>

          {/* 商品名 */}
          <h1 className="text-2xl font-bold text-gray-900">
            {getLocalizedText(currentProduct.title)}
          </h1>

          {/* 価格 */}
          <div className="text-3xl font-bold text-gray-900">
            ¥{currentProduct.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">{getLocalizedText(LANGUAGE_LIST.TaxIncluded)}</span>
          </div>

          {/* 商品説明 */}
          <div className="border rounded-lg p-4 max-h-128 overflow-y-auto">
            <MarkdownRenderer
              content={getLocalizedText(currentProduct.description)}
              className="text-gray-700"
            />
          </div>

          {/* 注意文言 */}
          <ReturnPolicyNotice />

          {/* バリエーション選択 */}
          {productItems.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-medium text-base text-gray-900">{getLocalizedText(LANGUAGE_LIST.Variation)}</h3>
              <div className="flex gap-2">
                {productItems.map((item, index) => (
                  <BlueButton
                    key={item.productId}
                    variant={selectedVariation === index ? "default" : "destructive"}
                    onClick={() => {
                      setSelectedVariation(index)
                      setAmount(1)
                      setSelectedImageIndex(0)
                      setCheckedConfirmations([])
                    }}
                  >
                    {getLocalizedText(item.title)}
                  </BlueButton>
                ))}
              </div>
            </div>
          )}

          {/* 在庫・数量選択 */}
          <div className="space-y-3">
            <h3 className="font-medium text-base text-gray-900">{getLocalizedText(LANGUAGE_LIST.Quantity)}</h3>
            <div className="flex items-end gap-4">
              <QuantitySelector
                value={amount}
                onChange={setAmount}
                min={1}
                max={maxQuantity}
              />
              {!currentProduct.hideStock && (
                <span className="text-sm">
                  {Math.max(currentProduct.stock, 0)}{getLocalizedText(LANGUAGE_LIST.Stock)}
                </span>
              )}
            </div>
          </div>

          {/* 購入確認チェック項目 */}
          {currentProduct.purchaseConfirmations && currentProduct.purchaseConfirmations.length > 0 && (
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="font-medium text-base text-gray-900">購入前の確認事項</h3>
              <div className="space-y-2">
                {currentProduct.purchaseConfirmations.map((confirmation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Checkbox
                      id={`confirmation-${index}`}
                      checked={checkedConfirmations[index] || false}
                      onCheckedChange={(checked) => {
                        const newChecked = [...checkedConfirmations]
                        newChecked[index] = checked as boolean
                        setCheckedConfirmations(newChecked)
                      }}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`confirmation-${index}`}
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      {getLocalizedText(confirmation)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {/* 事前相談ボタン */}
            {currentProduct.chatEnabled && currentProduct.hasStock && (
              <BlueButton variant="outline" onClick={onClickPreConsultation}>
                {simpleUser ? getLocalizedText(LANGUAGE_LIST.PreConsultation) : getLocalizedText(LANGUAGE_LIST.LoginToPreConsultation)}
              </BlueButton>
            )}
            {/* 購入ボタン */}
            {reachedUserLimit && (
              <RedButton className="cursor-not-allowed">
                購入制限
              </RedButton>
            )}
            {!reachedUserLimit && currentProduct.hasStock && (
              <BlueButton
                onClick={onClickPurchase}
                disabled={!allConfirmationsChecked}
                className={!allConfirmationsChecked ? "opacity-50 cursor-not-allowed" : ""}
              >
                {simpleUser ? getLocalizedText(LANGUAGE_LIST.BuyNow) : getLocalizedText(LANGUAGE_LIST.LoginToPurchase)}
              </BlueButton>
            )}
            {!reachedUserLimit && !currentProduct.hasStock && (
              <RedButton className="cursor-not-allowed">
                在庫切れ
              </RedButton>
            )}
          </div>


          {/* 詳細情報（折りたたみ） */}
          <ProductDetailCollapsible product={currentProduct} business={business} />
        </div>
      </div>
    </div>
  )
}