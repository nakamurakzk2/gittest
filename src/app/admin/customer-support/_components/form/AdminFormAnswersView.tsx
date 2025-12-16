'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileCheck, Clock, User, Eye } from "lucide-react"
import Image from "next/image"

// Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { FormAnswerSummary, FormAnswer, FormAnswerValue } from "@/entity/product/form"

// Logic
import * as AdminFormServerLogic from "@/logic/server/admin/admin-form-server-logic"
import { formatDate } from "@/logic/common-logic"


type Props = {
  townId: string
  businessId: string
}

export default function AdminFormAnswersView({ townId, businessId }: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [ formAnswerSummaries, setFormAnswerSummaries ] = useState<FormAnswerSummary[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { formAnswerSummaries } = await AdminFormServerLogic.fetchFormAnswerSummaries(townId, businessId)
      setFormAnswerSummaries(formAnswerSummaries)
    })
  }

  useEffect(() => {
    reload()
  }, [townId, businessId])


  const onClickExport = async () => {
    await onFetch(async () => {
      const { formAnswers, users, productItems, formMasters } = await AdminFormServerLogic.fetchFormAnswers(townId, businessId)

      // ユーザーと商品のマップを作成
      const userMap = new Map(users.map(user => [user.userId, user]))
      const productMap = new Map(productItems.map(item => [item.productId, item]))
      const formMasterMap = new Map(formMasters.map(master => [master.formId, master]))

      // formIdごとにグループ化
      const formAnswersByFormId = new Map<string, FormAnswer[]>()
      for (const formAnswer of formAnswers) {
        if (!formAnswersByFormId.has(formAnswer.formId)) {
          formAnswersByFormId.set(formAnswer.formId, [])
        }
        formAnswersByFormId.get(formAnswer.formId)!.push(formAnswer)
      }

      // CSVエスケープ関数
      const escapeCsv = (value: string | number | string[] | null | undefined): string => {
        if (value === null || value === undefined) {
          return ''
        }
        if (Array.isArray(value)) {
          return escapeCsv(value.join(', '))
        }
        const str = String(value)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      // 各フォームごとにCSVを生成してダウンロード
      for (const [formId, answers] of Array.from(formAnswersByFormId.entries())) {
        const formMaster = formMasterMap.get(formId)
        if (!formMaster) continue

        // ヘッダー行を作成
        const headers = [
          '商品名',
          '回答者',
          '回答日時',
          '編集日時',
          ...formMaster.fields.map(field => field.title.ja)
        ]

        // 回答日時の降順でソート
        const sortedAnswers = [...answers].sort((a, b) => b.createdAt - a.createdAt)

        // データ行を作成
        const rows = sortedAnswers.map((formAnswer: FormAnswer) => {
          const user = userMap.get(formAnswer.userId)
          const productItem = productMap.get(formAnswer.productId)

          const row: string[] = [
            escapeCsv(productItem?.title.ja || ''),
            escapeCsv(user?.billingInfo ? `${user.billingInfo.lastName}${user.billingInfo.firstName}` : ''),
            escapeCsv(formatDate(formAnswer.createdAt, 'yyyy/MM/dd hh:mm:ss')),
            escapeCsv(formAnswer.editedAt ? formatDate(formAnswer.editedAt, 'yyyy/MM/dd hh:mm:ss') : ''),
            ...formMaster.fields.map(field => {
              const answerValue = formAnswer.values.find((v: FormAnswerValue) => v.fieldId === field.fieldId)
              if (!answerValue) return ''
              if (Array.isArray(answerValue.value)) {
                return escapeCsv(answerValue.value.join(', '))
              }
              return escapeCsv(answerValue.value)
            })
          ]
          return row
        })

        // CSV文字列を生成
        const csvContent = [
          headers.join(','),
          ...rows.map((row: string[]) => row.join(','))
        ].join('\n')

        // BOMを追加してUTF-8でエンコード
        const bom = '\uFEFF'
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${formMaster.title.ja}_${formatDate(Date.now(), 'yyyyMMddhhmmss')}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    })
  }

  // lastUpdatedAtの降順でソート
  const sortedFormAnswerSummaries = [...formAnswerSummaries].sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">フォーム回答一覧</h3>
        <Button onClick={onClickExport}>
          <FileCheck className="h-4 w-4 mr-2" />
          エクスポート
        </Button>
      </div>

      <div className="grid gap-4">
        {sortedFormAnswerSummaries.map((summary) => (
          <Card key={summary.formMaster.formId} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-3">
                    {summary.formMaster.title.ja}
                  </CardTitle>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">最終回答日時</div>
                        <div className="text-sm font-medium">
                          {new Date(summary.lastUpdatedAt).toLocaleString('ja-JP')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">回答数</div>
                        <div className="text-lg font-bold">
                          {summary.answerCount}件
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {/* 商品画像 */}
                <div className="flex-shrink-0">
                  {summary.productItem.images.length > 0 ? (
                    <Image
                      src={summary.productItem.images[0]}
                      alt={summary.productItem.title.ja}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">画像なし</span>
                    </div>
                  )}
                </div>

                {/* 商品情報 */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 truncate">
                    {summary.productItem.title.ja}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {summary.productItem.description.ja}
                  </p>
                </div>

                {/* アクションボタン */}
                <div className="flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/customer-support/form-answers/${summary.productItem.productId}?formId=${summary.formMaster.formId}`)}>
                    <Eye className="h-4 w-4 mr-1" />
                    詳細
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedFormAnswerSummaries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          フォーム回答がありません
        </div>
      )}
    </div>
  )
}
