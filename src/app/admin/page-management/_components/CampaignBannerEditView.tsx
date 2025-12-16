'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { CampaignBanner } from "@/entity/page/top-page"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploadView from "@/components/common/ImageUploadView"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

interface Props {
  initialBanner?: CampaignBanner
}

export default function CampaignBannerEditView({
  initialBanner
}: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [image, setImage] = useState<string>(initialBanner?.image || "")
  const [link, setLink] = useState<string>(initialBanner?.link || "")
  const [startTime, setStartTime] = useState<number | null>(initialBanner?.startTime || null)
  const [endTime, setEndTime] = useState<number | null>(initialBanner?.endTime || null)
  const [hasStartTime, setHasStartTime] = useState<boolean>(!!initialBanner?.startTime)
  const [hasEndTime, setHasEndTime] = useState<boolean>(!!initialBanner?.endTime)

  const onClickSave = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    await onFetch(async () => {
      const banner: CampaignBanner = {
        campaignId: initialBanner?.campaignId || "",
        image,
        link,
        startTime: hasStartTime ? startTime : null,
        endTime: hasEndTime ? endTime : null,
        createdAt: initialBanner?.createdAt || Date.now(),
        updatedAt: Date.now()
      }

      await AdminPageServerLogic.upsertCampaignBanner(banner)

      toast({
        title: initialBanner ? "更新完了" : "作成完了",
        description: initialBanner ? "特集バナーを更新しました。" : "特集バナーを作成しました。"
      })

      router.push("/admin/page-management/campaign-banners")
    })
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* 画像アップロード */}
      <Card>
        <CardHeader>
          <CardTitle>特集バナー画像</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadView
            image={image}
            setImage={setImage}
            type="product"
            description="特集バナー画像をここにドラッグ&ドロップ"
            placeholder="または"
          />
        </CardContent>
      </Card>

      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="link">リンク先URL</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
            />
            <p className="text-sm text-muted-foreground">
              特集バナーをクリックした際の遷移先URLを入力してください
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
          onClick={() => router.push("/admin/page-management/campaign-banners")}
        >
          キャンセル
        </Button>
        <Button
          onClick={onClickSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "保存中..." : (initialBanner ? "特集バナーを更新" : "特集バナーを作成")}
        </Button>
      </div>
    </div>
  )
}
