"use client"

import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import Link from "next/link"

// Entity
import { BillingInfo } from "@/entity/user/user"
import { SimpleProductGroup, SimpleProductItem } from "@/entity/product/product"
import { SimpleBusiness } from "@/entity/town/business"
import { PaymentType } from "@/entity/product/payment"

// Components
import { Separator } from "@/components/ui/separator"
import { PaymentProductView } from "@/app/(page)/product/_components/PaymentProductView"

// Provider
import { useDialog } from "@/providers/dialog-provider"
import { useLanguageSession } from "@/providers/language-provider"

// Logic
import * as AddressLogic from "@/logic/address-logic"


type Props = {
  price: number
  amount: number
  billingInfo: BillingInfo
  simpleProductGroup: SimpleProductGroup
  simpleProductItem: SimpleProductItem
  simpleBusiness: SimpleBusiness
  tokenIds: number[]
  paymentType: PaymentType
}

export function PaymentResultView({ price, amount, billingInfo, simpleProductGroup, simpleProductItem, simpleBusiness, tokenIds, paymentType }: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()
  const { getLocalizedText } = useLanguageSession()

  const prefecture = AddressLogic.getPrefectures().find(pref => pref.prefcode === billingInfo.prefCode)


  if (simpleProductItem == null || simpleProductGroup == null) {
    return null
  }

  const unitPrice = simpleProductItem.price
  const total = unitPrice * amount

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* 左側 */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {billingInfo.lastName}様、ありがとうございます。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-black text-center">THANK YOU!!</h1>
            <p className="text-gray-700 text-sm font-bold text-center">
              ご登録いただいたメールアドレス宛に購入完了のメールを送信いたしました。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">請求情報</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-600">決済方法:</span>
                  <span className="ml-2">{paymentType === PaymentType.CREDIT ? 'クレジットカード' : '銀行'}</span>
                </div>
                <div>
                  <span className="text-gray-600">決済状況:</span>
                  <span className="ml-2 text-green-600">支払い済</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">請求先</h3>
              <div className="space-y-1 text-sm">
                <div className="text-gray-600">
                  {billingInfo.lastName} {billingInfo.firstName}
                </div>
                <div className="text-gray-700">
                  〒{billingInfo.zipCode}
                </div>
                <div className="text-gray-700">
                  {prefecture == null ? '' : prefecture.name}{billingInfo.city}{billingInfo.address} {billingInfo.building}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-lg mx-auto pb-10">
            {/* タイトル */}
            <Separator className="bg-gray-600" />
            <div className="text-center">
              <p className="text-red-600 font-bold">※要確認</p>
            </div>
            <Separator className="bg-gray-600" />

            {/* メインコンテンツ */}
            <div className="space-y-3 text-sm">
              <p>
                一部の商品につきましては、
                <span className="text-red-600 font-bold">
                  ご購入後にお届け先住所などの詳細情報を入力していただく必要
                </span>
                があります。
              </p>
              <p>
                お手数ですが、下記のURLより商品詳細ページヘアクセスのうえ、必要事項の入力を完了させてください。
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">何かお困りですか?</span>
              <Link href="https://help.alyawmu.com/hc/ja/requests/new" target="_blank" className="text-blue-600 hover:underline">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>


        {/* 右側: 商品情報 */}
        <div className="w-full lg:w-[450px] space-y-6">
          <PaymentProductView
            simpleProductGroup={simpleProductGroup}
            simpleProductItem={simpleProductItem}
            simpleBusiness={simpleBusiness}
            amount={amount}
            tokenIds={tokenIds}
          />
        </div>
      </div>
      <div>
        <Link href="/privacy" className="text-blue-600 hover:underline text-sm">
          プライバシーポリシー
        </Link>
      </div>
    </div>
  )
}
