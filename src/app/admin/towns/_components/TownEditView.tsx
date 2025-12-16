'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { Town } from "@/entity/town/town"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUploadView from "@/components/common/ImageUploadView"

// Logic
import * as AdinTownServerLogic from "@/logic/server/admin/admin-town-server-logic"
import * as AddressLogic from "@/logic/address-logic"

interface Props {
  town?: Town | null
}

export default function TownEditView({ town }: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [ name, setName ] = useState(town?.name || { ja: "", en: "", zh: "" })
  const [ description, setDescription ] = useState(town?.description || { ja: "", en: "", zh: "" })
  const [ image, setImage ] = useState(town?.image || "")
  const [ bannerImage, setBannerImage ] = useState(town?.bannerImage || "")
  const [ headerImage, setHeaderImage ] = useState(town?.headerImage || "")
  const [ mapImage, setMapImage ] = useState(town?.mapImage || "")
  const [ prefCode, setPrefCode ] = useState(town?.prefCode || 0)


  useEffect(() => {
    if (town == null) return
    setName(town.name)
    setDescription(town.description)
    setImage(town.image)
    setBannerImage(town.bannerImage)
    setHeaderImage(town.headerImage)
    setMapImage(town.mapImage)
    setPrefCode(town.prefCode || 1)
  }, [town])


  const prefectures = AddressLogic.getPrefectures()


  const onClickUpdate = async () => {
    const townData: Town = {
      townId: town?.townId || "",
      name,
      description,
      image,
      bannerImage,
      headerImage,
      mapImage,
      prefCode,
    }
    await onFetch(async () => {
      await AdinTownServerLogic.upsertTown(townData)
      toast({
        description: "自治体情報を登録しました",
      })
      router.push(`/admin/towns`)
    })
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">自治体情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              自治体名 <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name-ja" className="text-xs text-muted-foreground">
                  日本語
                </Label>
                <Input
                  id="name-ja"
                  value={name.ja}
                  onChange={(e) => setName({ ...name, ja: e.target.value })}
                  placeholder="自治体名を日本語で入力"
                />
              </div>
              <div>
                <Label htmlFor="name-en" className="text-xs text-muted-foreground">
                  英語
                </Label>
                <Input
                  id="name-en"
                  value={name.en}
                  onChange={(e) => setName({ ...name, en: e.target.value })}
                  placeholder="自治体名を英語で入力"
                />
              </div>
              <div>
                <Label htmlFor="name-zh" className="text-xs text-muted-foreground">
                  中国語
                </Label>
                <Input
                  id="name-zh"
                  value={name.zh}
                  onChange={(e) => setName({ ...name, zh: e.target.value })}
                  placeholder="自治体名を中国語で入力"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              説明 <span className="text-red-500">*</span>（「事業者について」で表示されます）
            </Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description-ja" className="text-xs text-muted-foreground">
                  日本語
                </Label>
                <Textarea
                  id="description-ja"
                  value={description.ja}
                  onChange={(e) => setDescription({ ...description, ja: e.target.value })}
                  placeholder="事業者の説明を日本語で入力"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="description-en" className="text-xs text-muted-foreground">
                  英語
                </Label>
                <Textarea
                  id="description-en"
                  value={description.en}
                  onChange={(e) => setDescription({ ...description, en: e.target.value })}
                  placeholder="事業者の説明を英語で入力"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="description-zh" className="text-xs text-muted-foreground">
                  中国語
                </Label>
                <Textarea
                  id="description-zh"
                  value={description.zh}
                  onChange={(e) => setDescription({ ...description, zh: e.target.value })}
                  placeholder="事業者の説明を中国語で入力"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">
              都道府県 <span className="text-red-500">*</span>
            </Label>
            <Select value={prefCode.toString()} onValueChange={(value) => setPrefCode(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="都道府県を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {prefectures.map((prefecture) => (
                  <SelectItem key={prefecture.prefcode} value={prefecture.prefcode.toString()}>
                    {prefecture.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">
              画像
            </Label>
            <ImageUploadView
              image={image}
              setImage={setImage}
              type="town"
              description="自治体の画像をアップロード"
              placeholder="または"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              バナー画像
            </Label>
            <ImageUploadView
              image={bannerImage}
              setImage={setBannerImage}
              type="town"
              description="自治体のバナー画像をアップロード"
              placeholder="または"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              ヘッダー画像
            </Label>
            <ImageUploadView
              image={headerImage}
              setImage={setHeaderImage}
              type="town"
              description="自治体のヘッダー画像をアップロード"
              placeholder="または"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              マップ画像
            </Label>
            <ImageUploadView
              image={mapImage}
              setImage={setMapImage}
              type="town"
              description="自治体のマップ画像をアップロード"
              placeholder="または"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href="/admin/towns">キャンセル</Link>
          </Button>
          <Button disabled={!name.ja || !name.en || !name.zh || prefCode === 0} onClick={onClickUpdate}>
            登録
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}