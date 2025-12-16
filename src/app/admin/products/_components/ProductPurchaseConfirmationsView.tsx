'use client'

import { useState } from "react"
import { AlertCircle, Plus, X } from "lucide-react"

import { MultiLanguageText } from "@/entity/language"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  initialPurchaseConfirmations?: MultiLanguageText[]
  setPurchaseConfirmations: (confirmations: MultiLanguageText[]) => void
}

export default function ProductPurchaseConfirmationsView({
  initialPurchaseConfirmations,
  setPurchaseConfirmations
}: Props) {
  const [activeLanguageTab, setActiveLanguageTab] = useState<"ja" | "en" | "zh">("ja")

  const [purchaseConfirmations, setPurchaseConfirmationsState] = useState<MultiLanguageText[]>(
    initialPurchaseConfirmations || []
  )

  const addConfirmation = () => {
    const newConfirmation: MultiLanguageText = { ja: "", en: "", zh: "" }
    const newConfirmations = [...purchaseConfirmations, newConfirmation]
    setPurchaseConfirmationsState(newConfirmations)
    setPurchaseConfirmations(newConfirmations)
  }

  const removeConfirmation = (index: number) => {
    const newConfirmations = purchaseConfirmations.filter((_, i) => i !== index)
    setPurchaseConfirmationsState(newConfirmations)
    setPurchaseConfirmations(newConfirmations)
  }

  const updateConfirmation = (index: number, lang: keyof MultiLanguageText, value: string) => {
    const newConfirmations = [...purchaseConfirmations]
    newConfirmations[index] = {
      ...newConfirmations[index],
      [lang]: value
    }
    setPurchaseConfirmationsState(newConfirmations)
    setPurchaseConfirmations(newConfirmations)
  }

  const checkLanguageCompletion = (lang: "ja" | "en" | "zh") => {
    return purchaseConfirmations.every(confirmation => confirmation[lang] && confirmation[lang].trim() !== "")
  }

  const getLanguageTabLabel = (lang: "ja" | "en" | "zh", label: string) => {
    const isComplete = checkLanguageCompletion(lang)
    return (
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {!isComplete && <AlertCircle className="h-3 w-3 text-amber-500" />}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">購入前の確認事項</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="mb-4">
          <Button type="button" onClick={addConfirmation} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            確認項目を追加
          </Button>
        </div>

        {purchaseConfirmations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm">確認項目が追加されていません</p>
            <p className="text-xs mt-1">「確認項目を追加」ボタンをクリックして項目を追加してください</p>
          </div>
        )}

        {purchaseConfirmations.length > 0 && (
          <Tabs value={activeLanguageTab} onValueChange={(value) => setActiveLanguageTab(value as "ja" | "en" | "zh")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ja">{getLanguageTabLabel("ja", "日本語")}</TabsTrigger>
              <TabsTrigger value="en">{getLanguageTabLabel("en", "English")}</TabsTrigger>
              <TabsTrigger value="zh">{getLanguageTabLabel("zh", "中文")}</TabsTrigger>
            </TabsList>

            <TabsContent value="ja" className="space-y-4 mt-4">
              {purchaseConfirmations.map((confirmation, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      確認項目 {index + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConfirmation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={confirmation.ja}
                    onChange={(e) => updateConfirmation(index, "ja", e.target.value)}
                    placeholder="確認事項を入力（例：返品・交換はできません）"
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="en" className="space-y-4 mt-4">
              {purchaseConfirmations.map((confirmation, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Confirmation Item {index + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConfirmation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={confirmation.en}
                    onChange={(e) => updateConfirmation(index, "en", e.target.value)}
                    placeholder="Enter confirmation item (e.g., No returns or exchanges)"
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="zh" className="space-y-4 mt-4">
              {purchaseConfirmations.map((confirmation, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      确认项目 {index + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConfirmation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={confirmation.zh}
                    onChange={(e) => updateConfirmation(index, "zh", e.target.value)}
                    placeholder="输入确认事项（例如：不可退货或换货）"
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

