'use client'

import { useState } from "react"
import { FileText } from "lucide-react"
import Image from "next/image"

// Entity
import { FormAnswer, FormFieldType, FormMaster } from "@/entity/product/form"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Logic
import * as CommonLogic from "@/logic/common-logic"

type Props = {
  formMasters: FormMaster[]
  formAnswers: FormAnswer[]
}

export default function AdminFormAnswersTab({ formMasters, formAnswers }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (formMasters.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">この商品にはフォームがありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {formMasters.map((formMaster) => {
        const answers = formAnswers.filter(answer => answer.formId === formMaster.formId)
        return (
          <Card key={formMaster.formId}>
            <CardHeader>
              <CardTitle className="text-lg">{formMaster.title.ja}</CardTitle>
              <p className="text-sm text-gray-600">{formMaster.description.ja}</p>
            </CardHeader>
            <CardContent>
              {answers.length === 0 ? (
                <p className="text-gray-500 text-sm">回答がありません</p>
              ) : (
                <div className="space-y-3">
                  {answers.sort((a, b) => b.createdAt - a.createdAt).map((answer, answerIndex) => (
                    <div key={answerIndex} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mt-2">
                        回答日時: {CommonLogic.formatDate(answer.createdAt, "yyyy/MM/dd hh:mm:ss")}
                      </div>
                      <div className="mt-1 space-y-2">
                        {formMaster.fields.map((field, fieldIndex) => {
                          const answerValue = answer.values.find(v => v.fieldId === field.fieldId)
                          if (!answerValue) return null
                          return (
                            <div key={fieldIndex} className="text-sm">
                              <span className="font-medium">{field.title.ja}:</span>
                              {field.type === FormFieldType.IMAGE && answerValue.images ? (
                                <div className="flex space-x-1">
                                  {answerValue.images.slice(0, 2).map((imageUrl, imgIndex) => (
                                    <div
                                      key={imgIndex}
                                      className="relative w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => setSelectedImage(imageUrl)}
                                    >
                                      <Image
                                        src={imageUrl}
                                        alt={`回答画像 ${imgIndex + 1}`}
                                        fill
                                        className="object-cover rounded border"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="ml-2">
                                  {Array.isArray(answerValue.value) ? answerValue.value.join(', ') : answerValue.value}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* 画像表示モーダル */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>画像詳細</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            {selectedImage && (
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedImage}
                  alt="拡大画像"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
