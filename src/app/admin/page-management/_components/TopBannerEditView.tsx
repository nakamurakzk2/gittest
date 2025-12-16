'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { MultiLanguageText } from "@/entity/language"
import { TopBanner } from "@/entity/page/top-page"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploadView from "@/components/common/ImageUploadView"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

interface Props {
  initialBanner?: TopBanner
}

export default function TopBannerEditView({
  initialBanner
}: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [activeLanguageTab, setActiveLanguageTab] = useState<"ja" | "en" | "zh">("ja")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitleState] = useState<MultiLanguageText>(initialBanner?.title || { ja: "", en: "", zh: "" })
  const [description, setDescriptionState] = useState<MultiLanguageText>(initialBanner?.description || { ja: "", en: "", zh: "" })
  const [image, setImage] = useState<string>(initialBanner?.image || "")
  const [link, setLink] = useState<string>(initialBanner?.link || "")
  const [startTime, setStartTime] = useState<number | null>(initialBanner?.startTime || null)
  const [endTime, setEndTime] = useState<number | null>(initialBanner?.endTime || null)
  const [hasStartTime, setHasStartTime] = useState<boolean>(!!initialBanner?.startTime)
  const [hasEndTime, setHasEndTime] = useState<boolean>(!!initialBanner?.endTime)

  const updateTitle = (lang: keyof MultiLanguageText, value: string) => {
    const newTitle = { ...title, [lang]: value }
    setTitleState(newTitle)
  }

  const updateDescription = (lang: keyof MultiLanguageText, value: string) => {
    const newDescription = { ...description, [lang]: value }
    setDescriptionState(newDescription)
  }

  const onClickSave = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    await onFetch(async () => {
      const banner: TopBanner = {
        bannerId: initialBanner?.bannerId || "",
        image,
        title,
        description,
        link,
        startTime: hasStartTime ? startTime : null,
        endTime: hasEndTime ? endTime : null,
        createdAt: initialBanner?.createdAt || Date.now(),
        updatedAt: Date.now()
      }

      await AdminPageServerLogic.upsertTopBanner(banner)

      toast({
        title: initialBanner ? "更新完了" : "作成完了",
        description: initialBanner ? "バナーを更新しました。" : "バナーを作成しました。"
      })

      router.push("/admin/page-management/top-banners")
    })
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* 画像アップロード */}
      <Card>
        <CardHeader>
          <CardTitle>バナー画像</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadView
            image={image}
            setImage={setImage}
            type="product"
            description="バナー画像をここにドラッグ&ドロップ"
            placeholder="または"
          />
        </CardContent>
      </Card>

      {/* テキスト編集 */}
      <Card>
        <CardHeader>
          <CardTitle>テキスト情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeLanguageTab} onValueChange={(value) => setActiveLanguageTab(value as "ja" | "en" | "zh")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ja">日本語</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="zh">中文</TabsTrigger>
            </TabsList>

            <TabsContent value="ja" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-ja">タイトル (日本語)</Label>
                <Input
                  id="title-ja"
                  value={title.ja}
                  onChange={(e) => updateTitle("ja", e.target.value)}
                  placeholder="バナーのタイトルを入力してください"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description-ja">説明 (日本語)</Label>
                <Input
                  id="description-ja"
                  value={description.ja}
                  onChange={(e) => updateDescription("ja", e.target.value)}
                  placeholder="バナーの説明を入力してください"
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-en">Title (English)</Label>
                <Input
                  id="title-en"
                  value={title.en}
                  onChange={(e) => updateTitle("en", e.target.value)}
                  placeholder="Enter banner title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description-en">Description (English)</Label>
                <Input
                  id="description-en"
                  value={description.en}
                  onChange={(e) => updateDescription("en", e.target.value)}
                  placeholder="Enter banner description"
                />
              </div>
            </TabsContent>

            <TabsContent value="zh" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-zh">标题 (中文)</Label>
                <Input
                  id="title-zh"
                  value={title.zh}
                  onChange={(e) => updateTitle("zh", e.target.value)}
                  placeholder="请输入横幅标题"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description-zh">描述 (中文)</Label>
                <Input
                  id="description-zh"
                  value={description.zh}
                  onChange={(e) => updateDescription("zh", e.target.value)}
                  placeholder="请输入横幅描述"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* リンク設定 */}
      <Card>
        <CardHeader>
          <CardTitle>リンク設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="link">リンク先URL</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
            />
            <p className="text-sm text-muted-foreground">
              バナーをクリックした際の遷移先URLを入力してください
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 表示期間設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            表示期間
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-start-time"
                    checked={hasStartTime}
                    onCheckedChange={(checked) => {
                      setHasStartTime(checked)
                      if (!checked) setStartTime(null)
                    }}
                  />
                  <Label htmlFor="has-start-time">
                    表示開始日時を設定する
                  </Label>
                </div>
                {hasStartTime && (
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={startTime ? new Date(startTime).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setStartTime(e.target.value ? new Date(e.target.value).getTime() : null)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-end-time"
                    checked={hasEndTime}
                    onCheckedChange={(checked) => {
                      setHasEndTime(checked)
                      if (!checked) setEndTime(null)
                    }}
                  />
                  <Label htmlFor="has-end-time">
                    表示終了日時を設定する
                  </Label>
                </div>
                {hasEndTime && (
                  <Input
                    id="end-time"
                    type="datetime-local"
                    value={endTime ? new Date(endTime).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setEndTime(e.target.value ? new Date(e.target.value).getTime() : null)}
                  />
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              開始日時のみ設定した場合、その日時以降に表示されます。<br />
              終了日時のみ設定した場合、その日時まで表示されます。<br />
              両方設定した場合、その期間中に表示されます。<br />
              どちらも設定しない場合、無制限で表示されます。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/page-management/top-banners")}
        >
          キャンセル
        </Button>
        <Button
          onClick={onClickSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "保存中..." : (initialBanner ? "バナーを更新" : "バナーを作成")}
        </Button>
      </div>
    </div>
  )
}
