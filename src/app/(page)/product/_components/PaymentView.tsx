"use client"

import { useState, useEffect } from "react"

// Entity
import { SimpleProductGroup, SimpleProductItem } from "@/entity/product/product"
import { PaymentProductView } from "@/app/(page)/product/_components/PaymentProductView"
import { BankPaymentInfoView } from "@/app/(page)/product/_components/BankPaymentInfoView"
import { PaymentMethodView } from "@/app/(page)/product/_components/PaymentMethodView"
import { PaymentBillingInfoView } from "@/app/(page)/product/_components/PaymentBillingInfoView"

// Provider
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as ProductPublicServerLogic from "@/logic/server/product/product-public-server-logic"
import * as UserEditPageServerLogic from "@/logic/server/user/user-edit-page-server-logic"

// Entity
import { ResponseBank } from "@/entity/response"
import { BillingInfo } from "@/entity/user/user"
import { SimpleBusiness } from "@/entity/town/business"


type Props = {
  productId: string
  amount: number
}

export function PaymentView({ productId, amount }: Props) {
  const { onFetch } = useDialog()

  // サーバから取得
  const [simpleProductGroup, setSimpleProductGroup] = useState<SimpleProductGroup | null>(null)
  const [simpleProductItem, setSimpleProductItem] = useState<SimpleProductItem | null>(null)
  const [simpleBusiness, setSimpleBusiness] = useState<SimpleBusiness | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userBillingInfo, setUserBillingInfo] = useState<BillingInfo | null>(null)

  // ユーザ入力
  const [email, setEmail] = useState<string | null>(null)
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [bankPaymentInfo, setBankPaymentInfo] = useState<ResponseBank | null>(null)

  const reload = async () => {
    await onFetch(async () => {
      const { simpleProductItem, simpleProductGroup } = await ProductPublicServerLogic.fetchSimpleProductProductItem(productId)
      const { email, billingInfo } = await UserEditPageServerLogic.fetchEditPage()

      // business情報を取得
      const { simpleBusiness } = await ProductPublicServerLogic.fetchSimpleProduct(simpleProductGroup.productGroupId)

      setSimpleProductGroup(simpleProductGroup)
      setSimpleProductItem(simpleProductItem)
      setSimpleBusiness(simpleBusiness)
      setUserEmail(email)
      setUserBillingInfo(billingInfo)
    })
  }

  useEffect(() => {
    reload()
  }, [productId])



  if (simpleProductItem == null || simpleProductGroup == null || simpleBusiness == null) {
    return null
  }

  const onNext = (email: string, billingInfo: BillingInfo) => {
    setEmail(email)
    setBillingInfo(billingInfo)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
      {/* 左側 */}
      <div className="flex-1 space-y-6">
        {bankPaymentInfo && (
          <BankPaymentInfoView
            bankPaymentInfo={bankPaymentInfo}
          />
        )}
        {/* 1. 請求先住所の入力 */}
        {bankPaymentInfo == null && email == null && billingInfo == null && (
          <PaymentBillingInfoView
            userEmail={email || userEmail || ""}
            userBillingInfo={billingInfo || userBillingInfo}
            onNext={onNext}
          />
        )}
        {/* 2. 決済方法の入力 */}
        {bankPaymentInfo == null && email && billingInfo && (
          <PaymentMethodView
            productId={productId}
            amount={amount}
            simpleProductItem={simpleProductItem}
            email={email}
            billingInfo={billingInfo}
            onReceiveBankPaymentInfo={setBankPaymentInfo}
          />
        )}
      </div>


      {/* 右側 */}
      <div className="w-full lg:w-[350px] space-y-6">
        {/* 商品情報 */}
        <PaymentProductView
          simpleProductGroup={simpleProductGroup}
          simpleProductItem={simpleProductItem}
          simpleBusiness={simpleBusiness}
          amount={amount}
        />
      </div>
    </div>
  )
}