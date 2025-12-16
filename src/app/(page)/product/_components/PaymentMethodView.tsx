"use client"

import { useMemo, useState } from "react"
import { Building, Banknote, Check } from "lucide-react"
import Image from "next/image"

// Entity
import { SimpleProductItem } from "@/entity/product/product"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BlueButton from "@/components/BlueButton"

// Provider
import { useDialog } from "@/providers/dialog-provider"
import { useLanguageSession } from "@/providers/language-provider"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as PaymentLogic from "@/logic/payment-logic"
import * as ProductPaymentServerLogic from "@/logic/server/product/product-payment-server-logic"

// Entity
import { ResponseBank } from "@/entity/response"

// Define
import { LANGUAGE_LIST } from "@/define/language"
import { BillingInfo } from "@/entity/user/user"


type Props = {
  productId: string
  amount: number
  simpleProductItem: SimpleProductItem
  email: string
  billingInfo: BillingInfo
  onReceiveBankPaymentInfo: (bankPaymentInfo: ResponseBank) => void
}

export function PaymentMethodView({ productId, amount, simpleProductItem, email, billingInfo, onReceiveBankPaymentInfo }: Props) {
  const { onFetch } = useDialog()
  const { getLocalizedText } = useLanguageSession()

  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [savePaymentInfo, setSavePaymentInfo] = useState(true)

  // Credit card form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpire, setCardExpire] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [cardholderName, setCardholderName] = useState("")

  const onChangeCardExpire = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cursorPosition = e.target.selectionStart || 0
    const previousValue = cardExpire

    // 数字以外を削除
    const numbersOnly = inputValue.replace(/\D/g, "")

    // 最大4桁まで
    if (numbersOnly.length > 4) {
      return
    }

    let formattedValue = numbersOnly

    // 2桁以上入力されたら / を挿入
    if (numbersOnly.length >= 2) {
      const month = numbersOnly.slice(0, 2)
      const year = numbersOnly.slice(2, 4)
      formattedValue = `${month}/${year}`
    }

    setCardExpire(formattedValue)

    // カーソル位置を調整
    setTimeout(() => {
      const input = e.target
      let newCursorPosition = cursorPosition

      // 削除操作の場合、カーソル位置を調整
      if (inputValue.length < previousValue.length) {
        // / の直後で削除した場合、/ も削除されるのでカーソル位置を調整
        if (previousValue[cursorPosition - 1] === '/') {
          newCursorPosition = cursorPosition - 1
        }
      } else {
        // 追加操作の場合、/ が挿入されたらカーソル位置を調整
        if (formattedValue.length > previousValue.length && formattedValue.includes('/') && !previousValue.includes('/')) {
          newCursorPosition = cursorPosition + 1
        }
      }

      // カーソル位置が範囲外にならないように調整
      newCursorPosition = Math.min(newCursorPosition, formattedValue.length)
      input.setSelectionRange(newCursorPosition, newCursorPosition)
    }, 0)
  }

  // Bank payment form state
  const [bankPaymentName, setBankPaymentName] = useState("")
  const [bankPaymentNameKana, setBankPaymentNameKana] = useState("")

  const canBuy = useMemo(() => {
    if (paymentMethod === "credit") {
      return cardNumber && cardExpire && securityCode && cardholderName
    }
    if (paymentMethod === "bank-payment") {
      return bankPaymentName && bankPaymentNameKana && CommonLogic.isZenkaku(bankPaymentName) && CommonLogic.isValidKana(bankPaymentNameKana)
    }
    return false
  }, [paymentMethod, cardNumber, cardExpire, securityCode, cardholderName, bankPaymentName, bankPaymentNameKana])


  const handlePurchase = async () => {
    if (simpleProductItem == null) return

    await onFetch(async () => {
      // 1. クレカ決済
      if (paymentMethod === "credit") {
        if (!cardNumber || !cardExpire || !securityCode || !cardholderName) {
          throw new Error(getLocalizedText(LANGUAGE_LIST.AllCreditCardInfoRequired))
        }
        const { key } = await ProductPaymentServerLogic.fetchTokenApiKey(simpleProductItem.townId)
        const token = await PaymentLogic.requestMdkToken(cardNumber, cardExpire, securityCode, cardholderName, key)
        const price = simpleProductItem.price * amount
        const { link, content } = await ProductPaymentServerLogic.buyCredit(productId, amount, price, token, email, billingInfo)
        location.href = link // 決済サイトに飛ぶ
        // setRedirectHtml(content)
      }

      // 2. 銀行決済
      if (paymentMethod === "bank-payment") {
        if (!bankPaymentName || !bankPaymentNameKana) {
          throw new Error(getLocalizedText(LANGUAGE_LIST.AllBankInfoRequired))
        }
        const price = simpleProductItem.price * amount
        const { link } = await ProductPaymentServerLogic.buyBank(productId, amount, price, bankPaymentName, bankPaymentNameKana, email, billingInfo)
        location.href = link // 決済サイトに飛ぶ
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{getLocalizedText(LANGUAGE_LIST.Payment)}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {getLocalizedText(LANGUAGE_LIST.SecureTransaction)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {/* Credit Card Option */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit" id="credit" />
              <Label htmlFor="credit" className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span>{getLocalizedText(LANGUAGE_LIST.CreditCard)}</span>
                <div className="flex items-center space-x-2">
                  <Image
                    src="/credit/visa.svg"
                    alt="Visa"
                    width={40}
                    height={24}
                    className="h-6 md:h-7 w-auto object-contain"
                  />
                  <Image
                    src="/credit/master.svg"
                    alt="Mastercard"
                    width={40}
                    height={24}
                    className="h-6 md:h-7 w-auto object-contain"
                  />
                  <Image
                    src="/credit/jcp.gif"
                    alt="JCB"
                    width={40}
                    height={24}
                    className="h-6 md:h-7 w-auto object-contain"
                  />
                  <Image
                    src="/credit/diners.gif"
                    alt="Diners Club"
                    width={40}
                    height={24}
                    className="h-6 md:h-7 w-auto object-contain"
                  />
                  <Image
                    src="/credit/amex.png"
                    alt="American Express"
                    width={40}
                    height={24}
                    className="h-6 md:h-7 w-auto object-contain"
                  />
                </div>
              </Label>
            </div>

            {paymentMethod === "credit" && (
              <div className="mt-4 space-y-4">
                <Input
                  placeholder={getLocalizedText(LANGUAGE_LIST.CardNumber)}
                  className="bg-gray-100"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder={getLocalizedText(LANGUAGE_LIST.ExpiryDate)}
                    className="bg-gray-100"
                    value={cardExpire}
                    onChange={onChangeCardExpire}
                    maxLength={5}
                  />
                  <Input
                    placeholder={getLocalizedText(LANGUAGE_LIST.CVV)}
                    className="bg-gray-100"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                  />
                </div>
                <Input
                  placeholder={getLocalizedText(LANGUAGE_LIST.CardholderName)}
                  className="bg-gray-100"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Bank Transfer Option */}
          {/*
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="bank-transfer" id="bank-transfer" />
              <Label htmlFor="bank-transfer" className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>{getLocalizedText(LANGUAGE_LIST.BankTransfer)}</span>
              </Label>
              <div className="ml-auto w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          */}

          {/* Bank Payment Option */}
          {/*
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="bank-payment" id="bank-payment" />
              <Label htmlFor="bank-payment" className="flex items-center space-x-2">
                <Banknote className="w-4 h-4" />
                <span>{getLocalizedText(LANGUAGE_LIST.BankPayment)}</span>
              </Label>
              <div className="ml-auto w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            {paymentMethod === "bank-payment" && (
              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <Input
                    placeholder={getLocalizedText(LANGUAGE_LIST.NamePlaceholder)}
                    className="bg-gray-100"
                    value={bankPaymentName}
                    onChange={(e) => setBankPaymentName(e.target.value)}
                  />
                  {bankPaymentName.length > 0 && !CommonLogic.isZenkaku(bankPaymentName) && (
                    <div className="text-xs text-red-500">
                      {getLocalizedText(LANGUAGE_LIST.FullWidthInput)}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Input
                    placeholder={getLocalizedText(LANGUAGE_LIST.NameKanaPlaceholder)}
                    className="bg-gray-100"
                    value={bankPaymentNameKana}
                    onChange={(e) => setBankPaymentNameKana(e.target.value)}
                  />
                  {bankPaymentNameKana.length > 0 && !CommonLogic.isValidKana(bankPaymentNameKana) && (
                    <div className="text-xs text-red-500">
                      {getLocalizedText(LANGUAGE_LIST.FullWidthKanaInput)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          */}
        </RadioGroup>
        <BlueButton onClick={handlePurchase} disabled={!canBuy}>
          {getLocalizedText(LANGUAGE_LIST.ConfirmPurchase)}
        </BlueButton>
      </CardContent>
    </Card>
  )
}
