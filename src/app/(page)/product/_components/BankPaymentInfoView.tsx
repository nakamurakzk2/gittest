"use client"

import { useRouter } from "next/navigation"
import { Building, Copy, AlertCircle } from "lucide-react"

// Entity
import { ResponseBank } from "@/entity/response"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import BlueButton from "@/components/BlueButton"

// Provider
import { useLanguageSession } from "@/providers/language-provider"
import { toast } from "@/components/hooks/use-toast"

type Props = {
  bankPaymentInfo: ResponseBank
}

export function BankPaymentInfoView({ bankPaymentInfo }: Props) {
  const router = useRouter()

  const { getLocalizedText } = useLanguageSession()

  const { shunoKikanNo, customerNo, confirmNo, simpleProductItem, totalPrice } = bankPaymentInfo

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "コピーしました",
    })
  }

  return (
    <div className="space-y-6">
      {/* 支払い情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>支払い情報</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            以下の内容で、ATMまたはインターネットバンキングによるお支払いをお願いいたします。
          </p>

          <Separator />

          {/* 収納機関番号 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">収納機関番号</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(shunoKikanNo)}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-lg font-bold">{shunoKikanNo}</span>
            </div>
          </div>

          {/* お客様番号 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">お客様番号</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(customerNo)}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-lg font-bold">{customerNo}</span>
            </div>
          </div>

          {/* 確認番号 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">確認番号</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(confirmNo)}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-lg font-bold">{confirmNo}</span>
            </div>
          </div>

          <Separator />

          {/* 支払い金額 */}
          <div className="space-y-2">
            <span className="text-sm text-gray-600">支払い金額</span>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <span className="font-mono text-xl text-right font-bold text-red-600">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 支払い期限 */}
          <div className="space-y-2">
            <span className="text-sm text-gray-600">支払い期限</span>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-800">
                  注文日から7日以内
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            ご登録いただいたメールアドレス宛にも同様の内容を送信いたしました。
          </p>
        </CardContent>
      </Card>


      <div className="flex justify-center space-x-4">
        <BlueButton onClick={() => router.push("/")}>
          ホームに戻る
        </BlueButton>
      </div>
    </div>
  )
}
