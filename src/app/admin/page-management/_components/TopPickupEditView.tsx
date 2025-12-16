'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { TopPickup, TopPickUpType } from "@/entity/page/top-page"
import { MultiLanguageText } from "@/entity/language"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploadView from "@/components/common/ImageUploadView"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

interface Props {
  initialPickup?: TopPickup
}

export default function TopPickupEditView({
  initialPickup
}: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [image, setImage] = useState<string>(initialPickup?.image || "")
  const [link, setLink] = useState<string>(initialPickup?.link || "")
  const [text, setText] = useState<MultiLanguageText>(initialPickup?.text || { ja: "", en: "", zh: "" })
  const [type, setType] = useState<TopPickUpType>(initialPickup?.type || TopPickUpType.NONE)
  const [startTime, setStartTime] = useState<number | null>(initialPickup?.startTime || null)
  const [endTime, setEndTime] = useState<number | null>(initialPickup?.endTime || null)
  const [hasStartTime, setHasStartTime] = useState<boolean>(!!initialPickup?.startTime)
  const [hasEndTime, setHasEndTime] = useState<boolean>(!!initialPickup?.endTime)

  const onClickSave = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    await onFetch(async () => {
      const pickup: TopPickup = {
        pickupId: initialPickup?.pickupId || "",
        image,
        link,
        text,
        type,
        startTime: hasStartTime ? startTime : null,
        endTime: hasEndTime ? endTime : null,
        createdAt: initialPickup?.createdAt || Date.now(),
        updatedAt: Date.now()
      }

      await AdminPageServerLogic.upsertTopPickup(pickup)

      toast({
        title: initialPickup ? "更新完了" : "作成完了",
        description: initialPickup ? "ピックアップを更新しました。" : "ピックアップを作成しました。"
      })

      router.push("/admin/page-management/top-pickups")
    })
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* 画像アップロード */}
      <Card>
        <CardHeader>
          <CardTitle>ピックアップ画像</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadView
            image={image}
            setImage={setImage}
            type="product"
            description="ピックアップ画像をここにドラッグ&ドロップ"
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
              ピックアップをクリックした際の遷移先URLを入力してください
            </p>
          </div>

          <div className="space-y-4">
            <Label>ホバーテキスト</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="text-ja">日本語</Label>
                <Textarea
                  id="text-ja"
                  value={text.ja}
                  onChange={(e) => setText({ ...text, ja: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-en">English</Label>
                <Textarea
                  id="text-en"
                  value={text.en}
                  onChange={(e) => setText({ ...text, en: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-zh">中文</Label>
                <Textarea
                  id="text-zh"
                  value={text.zh}
                  onChange={(e) => setText({ ...text, zh: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              ホバー時に表示されるテキストを各言語で入力してください。改行は\nで表現できます。
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">ピックアップタイプ</Label>
            <Select value={type} onValueChange={(value) => setType(value as TopPickUpType)}>
              <SelectTrigger>
                <SelectValue placeholder="ピックアップタイプを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TopPickUpType.NONE}>通常</SelectItem>
                <SelectItem value={TopPickUpType.SOLD_OUT}>売り切れ</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              ピックアップの表示タイプを選択してください
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
          onClick={() => router.push("/admin/page-management/top-pickups")}
        >
          キャンセル
        </Button>
        <Button
          onClick={onClickSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "保存中..." : (initialPickup ? "ピックアップを更新" : "ピックアップを作成")}
        </Button>
      </div>
    </div>
  )
}
