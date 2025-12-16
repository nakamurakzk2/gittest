"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"

// Entity
import { FormMaster, SimpleFormMaster } from "@/entity/product/form"

// Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import FormEditView from "@/components/form/FormEditView"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as AdminFormServerLogic from "@/logic/server/admin/admin-form-server-logic"


interface Props {
  formIds: string[]
  setFormIds: (formIds: string[]) => void
  townId: string
  businessId: string
}

export default function ProductFormSettingsView({ formIds, setFormIds, townId, businessId }: Props) {
  const { onFetch, setYesNoDialogData } = useDialog()

  const [formMasters, setFormMasters] = useState<SimpleFormMaster[]>([])
  const [isFormEditOpen, setIsFormEditOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<FormMaster | undefined>(undefined)

  const reload = async () => {
    if (townId === "" || businessId === "") return
    await onFetch(async () => {
      const { simpleFormMasters } = await AdminFormServerLogic.fetchSimpleFormMasters(townId, businessId)
      setFormMasters(simpleFormMasters)
    })
  }

  useEffect(() => {
    reload()
  }, [townId, businessId])


  /**
   * フォーム選択の変更
   * @param formId フォームID
   * @param checked 選択状態
   */
  const onClickFormToggle = (formId: string, checked: boolean) => {
    if (checked) {
      setFormIds([...formIds, formId])
    } else {
      setFormIds(formIds.filter(id => id !== formId))
    }
  }

  /**
   * 新規フォーム作成時
   */
  const onClickCreateForm = () => {
    setEditingForm(undefined)
    setIsFormEditOpen(true)
  }

  /**
   * フォーム編集ボタン押下時
   * @param formId フォームID
   */
  const onClickEditForm = async (formId: string) => {
    await onFetch(async () => {
      const { formMaster } = await AdminFormServerLogic.fetchFormMaster(formId)
      setEditingForm(formMaster)
      setIsFormEditOpen(true)
    })
  }

  /**
   * フォーム削除ボタン押下時
   * @param formId フォームID
   */
  const onClickDeleteForm = async (formId: string) => {
    setYesNoDialogData({
      title: "フォーム削除",
      description: "このフォームを削除しますか？",
      onOk: async () => {
        await onFetch(async () => {
          await AdminFormServerLogic.deleteFormMaster(formId)
          const { simpleFormMasters } = await AdminFormServerLogic.fetchSimpleFormMasters(townId, businessId)
          setFormMasters(simpleFormMasters)
          setFormIds(formIds.filter(id => id !== formId))
        })
      }
    })
  }

  /**
   * フォーム更新ボタン押下時
   * @param form フォームマスタ
   */
  const onClickUpdateForm = async (form: FormMaster) => {
    await onFetch(async () => {
      await AdminFormServerLogic.upsertFormMaster(form)
      const { simpleFormMasters } = await AdminFormServerLogic.fetchSimpleFormMasters(townId, businessId)
      setFormMasters(simpleFormMasters)
      setIsFormEditOpen(false)
      setEditingForm(undefined)
    })
  }


  // フォームの公開状態を取得
  const getFormStatus = (form: SimpleFormMaster) => {
    const now = Date.now()
    if (now < form.startTime) {
      return { status: "scheduled", label: "公開予定", variant: "secondary" as const }
    } else if (now > form.endTime) {
      return { status: "ended", label: "公開終了", variant: "destructive" as const }
    } else {
      return { status: "active", label: "公開中", variant: "default" as const }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">フォーム設定</CardTitle>
          <Button onClick={onClickCreateForm} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            新規フォーム作成
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {formMasters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>フォームが登録されていません</p>
            <p className="text-sm">「新規フォーム作成」ボタンからフォームを作成してください</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formMasters.map((form) => {
              const isSelected = formIds.includes(form.formId)
              const formStatus = getFormStatus(form)

              return (
                <div
                  key={form.formId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`form-${form.formId}`}
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onClickFormToggle(form.formId, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`form-${form.formId}`}
                          className="font-medium cursor-pointer"
                        >
                          {form.title.ja || form.title.en || form.title.zh}
                        </Label>
                        <Badge variant={formStatus.variant}>
                          {formStatus.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onClickEditForm(form.formId)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onClickDeleteForm(form.formId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {formIds.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">選択中のフォーム: {formIds.length}件</p>
          </div>
        )}
      </CardContent>

      {/* フォーム編集モーダル */}
      <Dialog open={isFormEditOpen} onOpenChange={setIsFormEditOpen}>
        <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {editingForm ? "フォーム編集" : "新規フォーム作成"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
            <FormEditView
              initialForm={editingForm}
              townId={townId}
              businessId={businessId}
              onSubmit={onClickUpdateForm}
              onCancel={() => {
                setIsFormEditOpen(false)
                setEditingForm(undefined)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
