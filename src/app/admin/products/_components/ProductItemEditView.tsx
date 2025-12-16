'use client'

import { useState, useEffect } from "react"

// Entity
import { ProductItem } from "@/entity/product/product"
import { MultiLanguageText } from "@/entity/language"

// Components
import ProductTextEditView from "@/app/admin/products/_components/ProductTextEditView"
import ProductSalesSettingsView from "@/app/admin/products/_components/ProductSalesSettingsView"
import ProductCategorySelectView from "@/app/admin/products/_components/ProductCategorySelectView"
import ProductFormSettingsView from "@/app/admin/products/_components/ProductFormSettingsView"
import ProductPublicationSettingsView from "@/app/admin/products/_components/ProductPublicationSettingsView"
import ProductPurchaseConfirmationsView from "@/app/admin/products/_components/ProductPurchaseConfirmationsView"

interface ProductFormProps {
  item: ProductItem
  townId: string
  businessId: string
  onUpdate: (item: ProductItem) => Promise<void> | void
}

export default function ProductItemEditView({ item, townId, businessId, onUpdate }: ProductFormProps) {


  const [ title, setTitle ] = useState(item.title || { ja: "", en: "", zh: "" })
  const [ description, setDescription ] = useState(item?.description || { ja: "", en: "", zh: "" })
  const [ price, setPrice ] = useState(item?.price || 0)
  const [ images, setImages ] = useState<string[]>(item?.images || [])
  const [ stock, setStock ] = useState(item?.stock || 0)
  const [ hideStock, setHideStock ] = useState(item?.hideStock || false)
  const [ deliveryText, setDeliveryText ] = useState(item?.deliveryText || { ja: "", en: "", zh: "" })
  const [ paymentText, setPaymentText ] = useState(item?.paymentText || { ja: "", en: "", zh: "" })
  const [ buyLimit, setBuyLimit ] = useState(item?.buyLimit || null)
  const [ categoryIds, setCategoryIds ] = useState<string[]>(item?.categoryIds || [])
  const [ chatEnabled, setChatEnabled ] = useState(item?.chatEnabled || false)
  const [ formIds, setFormIds ] = useState<string[]>(item?.formIds || [])
  const [ purchaseConfirmations, setPurchaseConfirmations ] = useState<MultiLanguageText[]>(item?.purchaseConfirmations || [])
  const [ startTime, setStartTime ] = useState<number | null>(item?.startTime || null)
  const [ endTime, setEndTime ] = useState<number | null>(item?.endTime || null)
  const [ isDraft, setIsDraft ] = useState(item?.isDraft || false)


  const update = () => {
    const proudctItem: ProductItem = {
      ...item,
      townId,
      businessId,
      title,
      description,
      price,
      images,
      stock,
      hideStock,
      deliveryText,
      paymentText,
      buyLimit,
      categoryIds,
      chatEnabled,
      formIds,
      purchaseConfirmations: purchaseConfirmations.length > 0 ? purchaseConfirmations : undefined,
      startTime,
      endTime,
      isDraft
    }
    onUpdate(proudctItem)
  }

  // リアルタイム更新: 状態が変更されるたびに update を呼び出す
  useEffect(() => {
    update()
  }, [title, description, price, images, stock, hideStock, deliveryText, paymentText, buyLimit, categoryIds, chatEnabled, formIds, purchaseConfirmations, startTime, endTime, isDraft])

  return (
    <div className="space-y-6">
      <ProductTextEditView
        initialTitle={item.title}
        initialDescription={item.description}
        initialDeliveryText={item.deliveryText}
        initialPaymentText={item.paymentText}
        setTitle={setTitle}
        setDescription={setDescription}
        setDeliveryText={setDeliveryText}
        setPaymentText={setPaymentText}
      />

      {/* 販売設定 */}
      <ProductSalesSettingsView
        price={price}
        setPrice={setPrice}
        images={images}
        setImages={setImages}
        stock={stock}
        setStock={setStock}
        buyLimit={buyLimit}
        setBuyLimit={setBuyLimit}
        hideStock={hideStock}
        setHideStock={setHideStock}
        chatEnabled={chatEnabled}
        setChatEnabled={setChatEnabled}
      />

      {/* カテゴリー */}
      <ProductCategorySelectView
        categoryIds={categoryIds}
        setCategoryIds={setCategoryIds}
      />

      {/* フォーム設定 */}
      <ProductFormSettingsView
        formIds={formIds}
        setFormIds={setFormIds}
        townId={townId}
        businessId={businessId}
      />

      {/* 公開設定 */}
      <ProductPublicationSettingsView
        isDraft={isDraft}
        setIsDraft={setIsDraft}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
      />

      {/* 購入前の確認事項 */}
      <ProductPurchaseConfirmationsView
        initialPurchaseConfirmations={item?.purchaseConfirmations}
        setPurchaseConfirmations={setPurchaseConfirmations}
      />
    </div>
  )
}