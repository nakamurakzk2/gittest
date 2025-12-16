'use client'

import { useState } from "react"
import { AlertCircle } from "lucide-react"

import { MultiLanguageText } from "@/entity/language"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MarkdownEditor } from "@/components/ui/markdown-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  initialTitle?: MultiLanguageText
  initialDescription?: MultiLanguageText
  initialDeliveryText?: MultiLanguageText
  initialPaymentText?: MultiLanguageText
  setTitle: (title: MultiLanguageText) => void
  setDescription: (description: MultiLanguageText) => void
  setDeliveryText: (deliveryText: MultiLanguageText) => void
  setPaymentText: (paymentText: MultiLanguageText) => void
}

export default function ProductTextEditView({
  initialTitle,
  initialDescription,
  initialDeliveryText,
  initialPaymentText,
  setTitle,
  setDescription,
  setDeliveryText,
  setPaymentText
}: Props) {
  const [activeLanguageTab, setActiveLanguageTab] = useState<"ja" | "en" | "zh">("ja")

  const [title, setTitleState] = useState<MultiLanguageText>(initialTitle || { ja: "", en: "", zh: "" })
  const [description, setDescriptionState] = useState<MultiLanguageText>(initialDescription || { ja: "", en: "", zh: "" })
  const [deliveryText, setDeliveryTextState] = useState<MultiLanguageText>(initialDeliveryText || { ja: "", en: "", zh: "" })
  const [paymentText, setPaymentTextState] = useState<MultiLanguageText>(initialPaymentText || { ja: "", en: "", zh: "" })

  const updateTitle = (lang: keyof MultiLanguageText, value: string) => {
    const newTitle = { ...title, [lang]: value }
    setTitleState(newTitle)
    setTitle(newTitle)
  }

  const updateDescription = (lang: keyof MultiLanguageText, value: string) => {
    const newDescription = { ...description, [lang]: value }
    setDescriptionState(newDescription)
    setDescription(newDescription)
  }

  const updateDeliveryText = (lang: keyof MultiLanguageText, value: string) => {
    const newDeliveryText = { ...deliveryText, [lang]: value }
    setDeliveryTextState(newDeliveryText)
    setDeliveryText(newDeliveryText)
  }

  const updatePaymentText = (lang: keyof MultiLanguageText, value: string) => {
    const newPaymentText = { ...paymentText, [lang]: value }
    setPaymentTextState(newPaymentText)
    setPaymentText(newPaymentText)
  }

  const checkLanguageCompletion = (lang: "ja" | "en" | "zh") => {
    const requiredFields = [
      title[lang],
      description[lang],
      deliveryText[lang],
      paymentText[lang]
    ]
    return requiredFields.every(field => field && field.trim() !== "")
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
        <CardTitle className="text-lg font-medium">テキスト情報</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Tabs value={activeLanguageTab} onValueChange={(value) => setActiveLanguageTab(value as "ja" | "en" | "zh")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ja">{getLanguageTabLabel("ja", "日本語")}</TabsTrigger>
          <TabsTrigger value="en">{getLanguageTabLabel("en", "English")}</TabsTrigger>
          <TabsTrigger value="zh">{getLanguageTabLabel("zh", "中文")}</TabsTrigger>
        </TabsList>

        <TabsContent value="ja" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title-ja" className="text-sm font-medium">
              商品名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title-ja"
              value={title.ja}
              onChange={(e) => updateTitle("ja", e.target.value)}
              placeholder="商品名を入力"
            />
          </div>

          <div>
            <Label htmlFor="description-ja" className="text-sm font-medium">
              商品説明 <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={description.ja}
              onChange={(value) => updateDescription("ja", value)}
              placeholder="商品の詳細説明を入力"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="deliveryText-ja" className="text-sm font-medium">
              配送について <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={deliveryText.ja}
              onChange={(value) => updateDeliveryText("ja", value)}
              placeholder="配送方法や期間について"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="paymentText-ja" className="text-sm font-medium">
              支払いについて <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={paymentText.ja}
              onChange={(value) => updatePaymentText("ja", value)}
              placeholder="利用可能な支払い方法"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="en" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title-en" className="text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title-en"
              value={title.en}
              onChange={(e) => updateTitle("en", e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="description-en" className="text-sm font-medium">
              Product Description <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={description.en}
              onChange={(value) => updateDescription("en", value)}
              placeholder="Enter detailed product description"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="deliveryText-en" className="text-sm font-medium">
              Delivery Information <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={deliveryText.en}
              onChange={(value) => updateDeliveryText("en", value)}
              placeholder="Delivery methods and timeframes"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="paymentText-en" className="text-sm font-medium">
              Payment Information <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={paymentText.en}
              onChange={(value) => updatePaymentText("en", value)}
              placeholder="Available payment methods"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="zh" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title-zh" className="text-sm font-medium">
              商品名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title-zh"
              value={title.zh}
              onChange={(e) => updateTitle("zh", e.target.value)}
              placeholder="请输入商品名称"
            />
          </div>

          <div>
            <Label htmlFor="description-zh" className="text-sm font-medium">
              商品描述 <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={description.zh}
              onChange={(value) => updateDescription("zh", value)}
              placeholder="请输入详细的商品描述"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="deliveryText-zh" className="text-sm font-medium">
              配送信息 <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={deliveryText.zh}
              onChange={(value) => updateDeliveryText("zh", value)}
              placeholder="配送方式和时间"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="paymentText-zh" className="text-sm font-medium">
              支付信息 <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={paymentText.zh}
              onChange={(value) => updatePaymentText("zh", value)}
              placeholder="可用的支付方式"
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>
      </CardContent>
    </Card>
  )
}