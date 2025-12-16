"use client"

import { useState } from "react"

// Components
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BlueButton from "@/components/BlueButton"
import RedButton from "@/components/RedButton"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { BillingInfo } from "@/entity/user/user"

// Logic
import * as AddressLogic from "@/logic/address-logic"
import * as UserEditPageServerLogic from "@/logic/server/user/user-edit-page-server-logic"

interface Props {
  billingInfo: BillingInfo | null
  onSave: () => void
  onCancel: () => void
}

// 都道府県のリストを取得
const prefectures = AddressLogic.getPrefectures()

export default function UpdateBillingInfoView({ billingInfo, onSave, onCancel }: Props) {
  const { onFetch } = useDialog()

  const [lastName, setLastName] = useState(billingInfo?.lastName || "")
  const [firstName, setFirstName] = useState(billingInfo?.firstName || "")
  const [lastNameKana, setLastNameKana] = useState(billingInfo?.lastNameKana || "")
  const [firstNameKana, setFirstNameKana] = useState(billingInfo?.firstNameKana || "")
  const [phoneNumber, setPhoneNumber] = useState(billingInfo?.phoneNumber || "")
  const [zipCode, setZipCode] = useState(billingInfo?.zipCode || "")
  const [prefCode, setPrefCode] = useState(billingInfo?.prefCode || undefined)
  const [city, setCity] = useState(billingInfo?.city || "")
  const [address, setAddress] = useState(billingInfo?.address || "")
  const [building, setBuilding] = useState(billingInfo?.building || "")

  /**
   * 郵便番号入力時の住所自動取得
   */
  const onZipCodeChange = async (value: string) => {
    setZipCode(value)

    const onlyNumberValue = value.replace(/[^0-9]/g, '')
    if (onlyNumberValue.length !== 7) return

    // 郵便番号が7桁の場合のみ住所取得を実行
    const addressData = await AddressLogic.fetchAddressFromZipCode(onlyNumberValue)
    if (addressData == null) return
    if (addressData.prefCode) {
      setPrefCode(addressData.prefCode)
    }
    if (addressData.city) {
      setCity(addressData.city)
    }
  }

  /**
   * 更新ボタン押下時
   */
  const onClickSave = async () => {
    await onFetch(async () => {
      const billingInfo = {
        lastName,
        firstName,
        lastNameKana,
        firstNameKana,
        phoneNumber,
        zipCode,
        prefCode,
        city,
        address,
        building
      }
      await UserEditPageServerLogic.updateBillingInfo(billingInfo)
      toast({
        description: "請求先住所情報を更新しました",
      })
      onSave()
    })
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        アカウント情報
      </h2>

      {/* 電話番号 */}
      <div className="mb-1">
        <Label className="text-sm font-bold text-gray-800">
          電話番号
        </Label>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 名前（2列レイアウト） */}
      <div className="grid grid-cols-2 gap-4 mb-1">
        <div>
          <Label className="text-sm font-bold text-gray-800">
            姓
          </Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm font-bold text-gray-800">
            名 (任意)
          </Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      {/* 名前（カタカナ） */}
      <div className="grid grid-cols-2 gap-4 mb-1">
        <div>
          <Label className="text-sm font-bold text-gray-800">
            セイ
          </Label>
          <Input
            value={lastNameKana}
            onChange={(e) => setLastNameKana(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-sm font-bold text-gray-800">
            メイ
          </Label>
          <Input
            value={firstNameKana}
            onChange={(e) => setFirstNameKana(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      {/* 請求先住所 */}
      <div className="my-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          請求先住所
        </h3>

        {/* 郵便番号 */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-gray-800">
            郵便番号
          </Label>
          <Input
            value={zipCode}
            onChange={(e) => onZipCodeChange(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* 都道府県 */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-gray-800">
            都道府県
          </Label>
          <Select
            value={prefCode?.toString()}
            onValueChange={(value) => setPrefCode(parseInt(value))}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="都道府県を選択" />
            </SelectTrigger>
            <SelectContent>
              {prefectures.map((pref) => (
                <SelectItem key={pref.prefcode} value={pref.prefcode.toString()}>
                  {pref.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 市区町村 */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-gray-800">
            市区町村
          </Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* 住所 */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-gray-800">
            住所
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* 建物名、部屋番号など */}
        <div className="mb-1">
          <Label className="text-sm font-bold text-gray-800">
            建物名、部屋番号など (任意)
          </Label>
          <Input
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            placeholder="建物名、部屋番号などを入力"
            className="mt-2"
          />
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-start gap-4">
        <BlueButton onClick={onClickSave}>
          確定する
        </BlueButton>
        <RedButton onClick={onCancel}>
          取り消す
        </RedButton>
      </div>
    </div>
  )
}
