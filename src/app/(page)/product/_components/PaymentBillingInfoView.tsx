"use client"

import { useState } from "react"

// Components
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BlueButton from "@/components/BlueButton"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Define
import { LANGUAGE_LIST } from "@/define/language"

// Entity
import { BillingInfo } from "@/entity/user/user"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as AddressLogic from "@/logic/address-logic"
import * as UserEditPageServerLogic from "@/logic/server/user/user-edit-page-server-logic"


type Props = {
  userEmail: string
  userBillingInfo: BillingInfo | null
  onNext: (email: string, billingInfo: BillingInfo) => void
}

// 都道府県のリストを取得
const prefectures = AddressLogic.getPrefectures()

export function PaymentBillingInfoView({ userEmail, userBillingInfo, onNext }: Props) {
  const { getLocalizedText } = useLanguageSession()
  const [email, setEmail] = useState(userEmail)
  const [lastName, setLastName] = useState(userBillingInfo?.lastName || "")
  const [firstName, setFirstName] = useState(userBillingInfo?.firstName || "")
  const [lastNameKana, setLastNameKana] = useState(userBillingInfo?.lastNameKana || "")
  const [firstNameKana, setFirstNameKana] = useState(userBillingInfo?.firstNameKana || "")
  const [phoneNumber, setPhoneNumber] = useState(userBillingInfo?.phoneNumber || "")
  const [zipCode, setZipCode] = useState(userBillingInfo?.zipCode || "")
  const [prefCode, setPrefCode] = useState(userBillingInfo?.prefCode || undefined)
  const [city, setCity] = useState(userBillingInfo?.city || "")
  const [address, setAddress] = useState(userBillingInfo?.address || "")
  const [building, setBuilding] = useState(userBillingInfo?.building || "")
  const [saveForNextTime, setSaveForNextTime] = useState(false)

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
   * 必須フィールドのバリデーション
   */
  const isFormValid = () => {
    return email.trim() !== "" &&
          CommonLogic.isValidEmail(email) &&
          phoneNumber.trim() !== "" &&
          lastName.trim() !== "" &&
          firstName.trim() !== "" &&
          lastNameKana.trim() !== "" &&
          firstNameKana.trim() !== "" &&
          zipCode.trim() !== "" &&
          prefCode !== undefined &&
          city.trim() !== "" &&
          address.trim() !== ""
  }

  /**
   * 更新ボタン押下時
   */
  const onClickNext = async () => {
    const billingInfo: BillingInfo = {
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
    if (saveForNextTime) {
      await UserEditPageServerLogic.updateBillingInfo(billingInfo)
    }
    onNext(email, billingInfo)
  }

  return (
    <div className="max-w-lg space-y-8">

      {/* メールアドレス */}
      <div className="space-y-2">
        <div className="text-md font-bold text-gray-800">
          {getLocalizedText(LANGUAGE_LIST.ContactInformation)}
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-800">
            {getLocalizedText(LANGUAGE_LIST.EmailAddressRequired)}
          </Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      {/* 電話番号と氏名 */}
      <div className="space-y-2">
        {/* 電話番号 */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-800">
            {getLocalizedText(LANGUAGE_LIST.PhoneNumberRequired)}
          </Label>
          <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        {/* 姓名 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-gray-800">
              {getLocalizedText(LANGUAGE_LIST.LastNameRequired)}
            </Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="space-y-1">
          <Label className="text-xs text-gray-800">
              {getLocalizedText(LANGUAGE_LIST.FirstNameRequired)}
            </Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
        </div>
        {/* セイメイ */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-gray-800">
              {getLocalizedText(LANGUAGE_LIST.LastNameKanaRequired)}
            </Label>
            <Input value={lastNameKana} onChange={(e) => setLastNameKana(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-800">
              {getLocalizedText(LANGUAGE_LIST.FirstNameKanaRequired)}
            </Label>
            <Input value={firstNameKana} onChange={(e) => setFirstNameKana(e.target.value)} />
          </div>
        </div>
      </div>

      {/* 請求先住所 */}
      <div className="space-y-2">
        <div className="text-md font-bold text-gray-800">
          {getLocalizedText(LANGUAGE_LIST.BillingAddress)}
        </div>

        {/* 郵便番号・都道府県 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-gray-800">
              {getLocalizedText(LANGUAGE_LIST.PostalCodeRequired)}
            </Label>
            <Input value={zipCode} onChange={(e) => onZipCodeChange(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-800">
              {getLocalizedText(LANGUAGE_LIST.PrefectureRequired)}
            </Label>
            <Select value={prefCode?.toString()} onValueChange={(value) => setPrefCode(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder={getLocalizedText(LANGUAGE_LIST.Prefecture)} />
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
        </div>

        {/* 市区町村 */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-800">
            {getLocalizedText(LANGUAGE_LIST.CityWardTownVillageRequired)}
          </Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        {/* 住所 */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-800">
            {getLocalizedText(LANGUAGE_LIST.AddressRequired)}
          </Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        {/* 建物名、部屋番号など */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-800">
            {getLocalizedText(LANGUAGE_LIST.BuildingNameRoomNumberOptional)}
          </Label>
          <Input value={building} onChange={(e) => setBuilding(e.target.value)} />
        </div>

        {/* チェックボックス */}
        <div className="flex items-center gap-1">
          <Checkbox checked={saveForNextTime} onCheckedChange={(checked) => setSaveForNextTime(checked as boolean)} />
          <Label className="text-sm text-gray-800">
            {getLocalizedText(LANGUAGE_LIST.SaveForNextTime)}
          </Label>
        </div>
      </div>


      {/* ボタン */}
      <div className="flex justify-start gap-4">
        <BlueButton
          variant="outline"
          onClick={onClickNext}
          disabled={!isFormValid()}
        >
          {getLocalizedText(LANGUAGE_LIST.ProceedToPaymentMethodSelection)}
        </BlueButton>
      </div>
    </div>
  )
}
