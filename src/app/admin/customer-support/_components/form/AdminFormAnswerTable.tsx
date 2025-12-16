'use client'

import Image from "next/image"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export default function AdminFormAnswerTable({ formAnswers, formMaster, getUserInfo }: Props) {
  // フィールドタイプに応じた表示形式を取得
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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead className="w-40">回答日時</TableHead>
            <TableHead className="w-32">回答者</TableHead>
            {formMaster.fields.map((field) => (
              <TableHead key={field.fieldId} className="min-w-32">
                {field.title.ja}
                {field.required && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    必須
                  </Badge>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {formAnswers.map((answer, index) => {
            const userInfo = getUserInfo(answer.userId)
            return (
              <TableRow key={answer.answerId}>
                <TableCell className="font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-sm">
                  <div>
                    <div className="font-medium">
                      {CommonLogic.formatDate(answer.createdAt, "yyyy/MM/dd hh:mm:ss")}
                    </div>
                    {answer.editedAt && (
                      <div className="text-xs text-gray-500">
                        編集: {CommonLogic.formatDate(answer.editedAt, "yyyy/MM/dd hh:mm:ss")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="font-medium">
                    {userInfo ?
                      `${userInfo.billingInfo.lastName} ${userInfo.billingInfo.firstName}` :
                      '不明なユーザー'
                    }
                  </div>
                </TableCell>
                {formMaster.fields.map((field) => {
                  const answerValue = answer.values.find(v => v.fieldId === field.fieldId)

                  return (
                    <TableCell key={field.fieldId} className="max-w-xs">
                      {answerValue ? (
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs mb-1">
                            {field.type === FormFieldType.TEXT_SHORT && '短文テキスト'}
                            {field.type === FormFieldType.TEXT_LONG && '長文テキスト'}
                            {field.type === FormFieldType.SELECT_SINGLE && '単一選択'}
                            {field.type === FormFieldType.SELECT_MULTIPLE && '複数選択'}
                            {field.type === FormFieldType.DATE && '日付'}
                            {field.type === FormFieldType.IMAGE && '画像'}
                          </Badge>
                          <div className="text-sm">
                            {field.type === FormFieldType.IMAGE && answerValue.images ? (
                              <div className="flex space-x-1">
                                {answerValue.images.slice(0, 2).map((imageUrl, imgIndex) => (
                                  <div key={imgIndex} className="relative w-12 h-12">
                                    <Image
                                      src={imageUrl}
                                      alt={`回答画像 ${imgIndex + 1}`}
                                      fill
                                      className="object-cover rounded border"
                                    />
                                  </div>
                                ))}
                                {answerValue.images.length > 2 && (
                                  <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs">
                                    +{answerValue.images.length - 2}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="truncate" title={String(getFieldDisplayValue(field.type, answerValue.value))}>
                                {getFieldDisplayValue(field.type, answerValue.value)}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">未回答</span>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
