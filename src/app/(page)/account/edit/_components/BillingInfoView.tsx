"use client"

// Entity
import { BillingInfo } from "@/entity/user/user"

// Logic
import * as AddressLogic from "@/logic/address-logic"

interface Props {
  billingInfo: BillingInfo | null
}

export default function BillingInfoView({ billingInfo }: Props) {
  const prefectures = AddressLogic.getPrefectures()

  const selectedPrefecture = billingInfo?.prefCode
    ? prefectures.find(p => p.prefcode === billingInfo.prefCode)
    : undefined

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        アカウント情報
      </h2>

      {/* 電話番号 */}
      <div className="mb-6">
        <div className="text-sm font-bold text-gray-800 mb-2">
          電話番号
        </div>
        <div className="text-gray-700">
          {billingInfo?.phoneNumber || "未設定"}
        </div>
      </div>

      {/* 名前 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2">
            姓
          </div>
          <div className="text-gray-700">
            {billingInfo?.lastName || "未設定"}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2">
            名
          </div>
          <div className="text-gray-700">
            {billingInfo?.firstName || "未設定"}
          </div>
        </div>
      </div>

      {/* 名前（カタカナ） */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2">
            セイ
          </div>
          <div className="text-gray-700">
            {billingInfo?.lastNameKana || "未設定"}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2">
            メイ
          </div>
          <div className="text-gray-700">
            {billingInfo?.firstNameKana || "未設定"}
          </div>
        </div>
      </div>

      {/* 請求先住所 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          請求先住所
        </h3>

        {/* 郵便番号 */}
        <div className="mb-4">
          <div className="text-sm font-bold text-gray-800 mb-2">
            郵便番号
          </div>
          <div className="text-gray-700">
            {billingInfo?.zipCode || "未設定"}
          </div>
        </div>

        {/* 都道府県 */}
        <div className="mb-4">
          <div className="text-sm font-bold text-gray-800 mb-2">
            都道府県
          </div>
          <div className="text-gray-700">
            {selectedPrefecture?.name || "未設定"}
          </div>
        </div>

        {/* 市区町村 */}
        <div className="mb-4">
          <div className="text-sm font-bold text-gray-800 mb-2">
            市区町村
          </div>
          <div className="text-gray-700">
            {billingInfo?.city || "未設定"}
          </div>
        </div>

        {/* 住所 */}
        <div className="mb-4">
          <div className="text-sm font-bold text-gray-800 mb-2">
            住所
          </div>
          <div className="text-gray-700">
            {billingInfo?.address || "未設定"}
          </div>
        </div>

        {/* 建物名、部屋番号など */}
        <div className="mb-4">
          <div className="text-sm font-bold text-gray-800 mb-2">
            建物名、部屋番号など
          </div>
          <div className="text-gray-700">
            {billingInfo?.building || "未設定"}
          </div>
        </div>
      </div>
    </div>
  )
}
