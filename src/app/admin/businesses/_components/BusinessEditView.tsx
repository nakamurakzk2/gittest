'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { Business } from "@/entity/town/business"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Logic
import * as AdminBusinessServerLogic from "@/logic/server/admin/admin-business-server-logic"


interface Props {
  townId: string
  business?: Business | null
}

export default function BusinessEditView({ townId, business }: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [ name, setName ] = useState(business?.name || "")
  const [ description, setDescription ] = useState(business?.description || { ja: "", en: "", zh: "" })


  const onClickUpdate = async () => {
    const businessData: Business = {
      businessId: business?.businessId || "",
      townId,
      name,
      description,
      createdAt: business?.createdAt || 0,
      updatedAt: business?.updatedAt || 0,
    }
    await onFetch(async () => {
      await AdminBusinessServerLogic.upsertBusiness(businessData)
      toast({
        description: "事業者情報を登録しました",
      })
      router.push(`/admin/businesses`)
    })
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">事業者情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              事業者名 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="事業者名を入力"
            />
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
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href="/admin/businesses">キャンセル</Link>
          </Button>
          <Button disabled={name.length === 0} onClick={onClickUpdate}>
            登録
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}