'use client'

import { UserIcon } from "lucide-react"
import Image from "next/image"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Entity
import { FormAnswer, FormMaster, FormFieldType } from "@/entity/product/form"
import { User } from "@/entity/user/user"

// Logic
import * as CommonLogic from "@/logic/common-logic"

type Props = {
  formAnswers: FormAnswer[]
  formMaster: FormMaster
  getUserInfo: (userId: string) => User | undefined
}

export default function AdminFormAnswerCard({ formAnswers, formMaster, getUserInfo }: Props) {
  const getFieldDisplayValue = (fieldType: FormFieldType, value: string | string[] | number) => {
    switch (fieldType) {
      case FormFieldType.TEXT_SHORT:
      case FormFieldType.TEXT_LONG:
        return String(value)
      case FormFieldType.SELECT_SINGLE:
        return String(value)
      case FormFieldType.SELECT_MULTIPLE:
        return Array.isArray(value) ? value.join(', ') : String(value)
      case FormFieldType.DATE:
        return new Date(Number(value)).toLocaleDateString('ja-JP')
      case FormFieldType.IMAGE:
        return Array.isArray(value) ? value : [String(value)]
      default:
        return String(value)
    }
  }

  return (
    <div className="space-y-4">
      {formAnswers.map((answer, index) => {
        const userInfo = getUserInfo(answer.userId)
        return (
          <Card key={answer.answerId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    回答 #{index + 1}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span>
                      {userInfo ?
                        `${userInfo.billingInfo.lastName} ${userInfo.billingInfo.firstName}` :
                        '不明なユーザー'
                      }
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Badge variant="outline">
                    {CommonLogic.formatDate(answer.createdAt, "yyyy/MM/dd hh:mm:ss")}
                  </Badge>
                  {answer.editedAt && (
                    <Badge variant="secondary">
                      編集済み
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formMaster.fields.map((field) => {
                  const answerValue = answer.values.find(v => v.fieldId === field.fieldId)
                  if (!answerValue) return null

                  return (
                    <div key={field.fieldId} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {field.title.ja}
                        </h4>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">
                            必須
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {field.type === FormFieldType.TEXT_SHORT && '短文テキスト'}
                          {field.type === FormFieldType.TEXT_LONG && '長文テキスト'}
                          {field.type === FormFieldType.SELECT_SINGLE && '単一選択'}
                          {field.type === FormFieldType.SELECT_MULTIPLE && '複数選択'}
                          {field.type === FormFieldType.DATE && '日付'}
                          {field.type === FormFieldType.IMAGE && '画像'}
                        </Badge>
                      </div>

                      <div className="text-gray-700">
                        {field.type === FormFieldType.IMAGE && answerValue.images ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {answerValue.images.map((imageUrl, imgIndex) => (
                              <div key={imgIndex} className="relative w-full h-32">
                                <Image
                                  src={imageUrl}
                                  alt={`回答画像 ${imgIndex + 1}`}
                                  fill
                                  className="object-cover rounded-lg border"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">
                            {getFieldDisplayValue(field.type, answerValue.value)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
