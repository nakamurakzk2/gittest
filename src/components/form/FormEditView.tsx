"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, Type, FileText, CheckSquare, Calendar, Image } from "lucide-react"

import { FormMaster, FormField, FormFieldType } from "@/entity/product/form"
import { MultiLanguageText } from "@/entity/language"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type FormMasterFormData = {
  formId: string
  title: MultiLanguageText
  description: MultiLanguageText
  startTime: number
  endTime: number
  allowEdit: boolean
  fields: FormField[]
}

interface Props {
  initialForm?: FormMaster
  townId: string
  businessId: string
  onSubmit: (form: FormMaster) => void
  onCancel: () => void
}

export default function FormEditView({
  initialForm,
  townId,
  businessId,
  onSubmit,
  onCancel
}: Props) {
  const [activeLanguageTab, setActiveLanguageTab] = useState<"ja" | "en" | "zh">("ja")
  const [formData, setFormData] = useState<FormMasterFormData>({
    formId: initialForm?.formId || "",
    title: initialForm?.title || { ja: "", en: "", zh: "" },
    description: initialForm?.description || { ja: "", en: "", zh: "" },
    startTime: initialForm?.startTime || Date.now(),
    endTime: initialForm?.endTime || Date.now() + 7 * 24 * 60 * 60 * 1000, // 7日後
    allowEdit: initialForm?.allowEdit || false,
    fields: initialForm?.fields || []
  })
  // フォームデータの更新
  const updateFormData = (updates: Partial<FormMasterFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  // フィールドの追加
  const addField = () => {
    const newField: FormField = {
      fieldId: `field_${Date.now()}`,
      type: FormFieldType.TEXT_SHORT,
      title: { ja: "", en: "", zh: "" },
      required: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    updateFormData({ fields: [...formData.fields, newField] })
  }

  // フィールドの削除
  const removeField = (index: number) => {
    const newFields = formData.fields.filter((_, i) => i !== index)
    updateFormData({ fields: newFields })
  }

  // フィールドの順序変更
  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...formData.fields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)
    updateFormData({ fields: newFields })
  }

  // フィールドタイプの変更
  const updateFieldType = (index: number, type: FormFieldType) => {
    const newFields = [...formData.fields]
    newFields[index] = {
      ...newFields[index],
      type,
      // タイプに応じてオプションをクリア
      options: type === FormFieldType.SELECT_SINGLE || type === FormFieldType.SELECT_MULTIPLE
        ? newFields[index].options || []
        : undefined,
      maxImages: type === FormFieldType.IMAGE
        ? newFields[index].maxImages || 1
        : undefined
    }
    updateFormData({ fields: newFields })
  }

  // 選択肢の追加
  const addOption = (fieldIndex: number) => {
    const newFields = [...formData.fields]
    const currentOptions = newFields[fieldIndex].options || []
    newFields[fieldIndex] = {
      ...newFields[fieldIndex],
      options: [...currentOptions, ""]
    }
    updateFormData({ fields: newFields })
  }

  // 選択肢の削除
  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...formData.fields]
    const currentOptions = newFields[fieldIndex].options || []
    newFields[fieldIndex] = {
      ...newFields[fieldIndex],
      options: currentOptions.filter((_, i) => i !== optionIndex)
    }
    updateFormData({ fields: newFields })
  }

  // 選択肢の更新
  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const newFields = [...formData.fields]
    const currentOptions = newFields[fieldIndex].options || []
    currentOptions[optionIndex] = value
    newFields[fieldIndex] = {
      ...newFields[fieldIndex],
      options: currentOptions
    }
    updateFormData({ fields: newFields })
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const formMaster: FormMaster = {
      ...formData,
      townId,
      businessId,
      createdAt: initialForm?.createdAt || Date.now(),
      updatedAt: Date.now()
    }
    onSubmit(formMaster)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={onSubmitForm} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">基本情報</h3>

              <Tabs value={activeLanguageTab} onValueChange={(value) => setActiveLanguageTab(value as "ja" | "en" | "zh")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ja">日本語</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="zh">中文</TabsTrigger>
                </TabsList>

                <TabsContent value="ja" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title-ja">タイトル *</Label>
                    <Input
                      id="title-ja"
                      value={formData.title.ja}
                      onChange={(e) => updateFormData({
                        title: { ...formData.title, ja: e.target.value }
                      })}
                      placeholder="フォームのタイトルを入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description-ja">説明 *</Label>
                    <Textarea
                      id="description-ja"
                      value={formData.description.ja}
                      onChange={(e) => updateFormData({
                        description: { ...formData.description, ja: e.target.value }
                      })}
                      placeholder="フォームの説明を入力"
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title-en">Title *</Label>
                    <Input
                      id="title-en"
                      value={formData.title.en}
                      onChange={(e) => updateFormData({
                        title: { ...formData.title, en: e.target.value }
                      })}
                      placeholder="Enter form title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description-en">Description *</Label>
                    <Textarea
                      id="description-en"
                      value={formData.description.en}
                      onChange={(e) => updateFormData({
                        description: { ...formData.description, en: e.target.value }
                      })}
                      placeholder="Enter form description"
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="zh" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title-zh">标题 *</Label>
                    <Input
                      id="title-zh"
                      value={formData.title.zh}
                      onChange={(e) => updateFormData({
                        title: { ...formData.title, zh: e.target.value }
                      })}
                      placeholder="输入表单标题"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description-zh">描述 *</Label>
                    <Textarea
                      id="description-zh"
                      value={formData.description.zh}
                      onChange={(e) => updateFormData({
                        description: { ...formData.description, zh: e.target.value }
                      })}
                      placeholder="输入表单描述"
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* 設定 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">設定</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">公開開始日時</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={new Date(formData.startTime).toISOString().slice(0, 16)}
                    onChange={(e) => updateFormData({
                      startTime: new Date(e.target.value).getTime()
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">公開終了日時</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={new Date(formData.endTime).toISOString().slice(0, 16)}
                    onChange={(e) => updateFormData({
                      endTime: new Date(e.target.value).getTime()
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowEdit"
                  checked={formData.allowEdit}
                  onCheckedChange={(checked) => updateFormData({
                    allowEdit: checked as boolean
                  })}
                />
                <Label htmlFor="allowEdit">回答後の編集を許可する</Label>
              </div>
            </div>

            {/* フィールド設定 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">回答項目</h3>
                <Button type="button" onClick={addField} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  項目を追加
                </Button>
              </div>

              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <Card key={field.fieldId}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          <span className="text-sm font-medium">項目 {index + 1}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* フィールドタイトル（多言語） */}
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-sm">日本語タイトル *</Label>
                          <Input
                            value={field.title.ja}
                            onChange={(e) => {
                              const newFields = [...formData.fields]
                              newFields[index] = {
                                ...newFields[index],
                                title: { ...newFields[index].title, ja: e.target.value }
                              }
                              updateFormData({ fields: newFields })
                            }}
                            placeholder="項目のタイトルを入力"
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-sm">English Title *</Label>
                          <Input
                            value={field.title.en}
                            onChange={(e) => {
                              const newFields = [...formData.fields]
                              newFields[index] = {
                                ...newFields[index],
                                title: { ...newFields[index].title, en: e.target.value }
                              }
                              updateFormData({ fields: newFields })
                            }}
                            placeholder="Enter field title"
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-sm">中文标题 *</Label>
                          <Input
                            value={field.title.zh}
                            onChange={(e) => {
                              const newFields = [...formData.fields]
                              newFields[index] = {
                                ...newFields[index],
                                title: { ...newFields[index].title, zh: e.target.value }
                              }
                              updateFormData({ fields: newFields })
                            }}
                            placeholder="输入字段标题"
                            className="h-8"
                          />
                        </div>
                      </div>

                      {/* フィールドタイプ選択 */}
                      <div className="space-y-2">
                        <Label>フィールドタイプ</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={field.type === FormFieldType.TEXT_SHORT ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFieldType(index, FormFieldType.TEXT_SHORT)}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                          >
                            <Type className="h-4 w-4" />
                            <span className="text-xs">短文</span>
                          </Button>

                          <Button
                            type="button"
                            variant={field.type === FormFieldType.TEXT_LONG ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFieldType(index, FormFieldType.TEXT_LONG)}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="text-xs">長文</span>
                          </Button>

                          <Button
                            type="button"
                            variant={field.type === FormFieldType.SELECT_SINGLE ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFieldType(index, FormFieldType.SELECT_SINGLE)}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                          >
                            <CheckSquare className="h-4 w-4" />
                            <span className="text-xs">単一選択</span>
                          </Button>

                          <Button
                            type="button"
                            variant={field.type === FormFieldType.SELECT_MULTIPLE ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFieldType(index, FormFieldType.SELECT_MULTIPLE)}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                          >
                            <CheckSquare className="h-4 w-4" />
                            <span className="text-xs">複数選択</span>
                          </Button>

                          <Button
                            type="button"
                            variant={field.type === FormFieldType.DATE ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFieldType(index, FormFieldType.DATE)}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                          >
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs">日付</span>
                          </Button>

                          <Button
                            type="button"
                            variant={field.type === FormFieldType.IMAGE ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFieldType(index, FormFieldType.IMAGE)}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                          >
                            <Image className="h-4 w-4" />
                            <span className="text-xs">画像</span>
                          </Button>
                        </div>
                      </div>

                      {/* 必須設定 */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.required}
                          onCheckedChange={(checked) => {
                            const newFields = [...formData.fields]
                            newFields[index] = {
                              ...newFields[index],
                              required: checked as boolean
                            }
                            updateFormData({ fields: newFields })
                          }}
                        />
                        <Label>必須項目</Label>
                      </div>

                      {/* 選択肢設定 */}
                      {(field.type === FormFieldType.SELECT_SINGLE || field.type === FormFieldType.SELECT_MULTIPLE) && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>選択肢</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(index)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              選択肢を追加
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {field.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                  placeholder={`選択肢 ${optionIndex + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(index, optionIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* 最大画像数設定 */}
                      {field.type === FormFieldType.IMAGE && (
                        <div className="space-y-2">
                          <Label>最大画像数</Label>
                          <Input
                            type="number"
                            value={field.maxImages || ""}
                            onChange={(e) => {
                              const newFields = [...formData.fields]
                              newFields[index] = {
                                ...newFields[index],
                                maxImages: e.target.value ? parseInt(e.target.value) : undefined
                              }
                              updateFormData({ fields: newFields })
                            }}
                            placeholder="最大画像数を入力"
                            min="1"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                キャンセル
              </Button>
              <Button type="submit">
                {initialForm ? "更新" : "作成"}
              </Button>
            </div>
          </form>
    </div>
  )
}
