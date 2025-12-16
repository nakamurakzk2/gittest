'use client'

import { useState } from "react"
import { Grid3X3, List, FileCheck } from "lucide-react"

// Components
import { Button } from "@/components/ui/button"

// Entity
import { FormAnswer, FormMaster } from "@/entity/product/form"
import { User } from "@/entity/user/user"

// Components
import AdminFormAnswerCard from "@/app/admin/customer-support/_components/form/AdminFormAnswerCard"
import AdminFormAnswerTable from "@/app/admin/customer-support/_components/form/AdminFormAnswerTable"

type Props = {
  formAnswers: FormAnswer[]
  formMaster: FormMaster
  users: User[]
}

export default function AdminFormAnswersList({ formAnswers, formMaster, users }: Props) {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  // ユーザー情報を取得する関数
  const getUserInfo = (userId: string) => {
    return users.find(user => user.userId === userId)
  }

  if (formAnswers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>まだ回答がありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ビュー切り替えボタン */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">回答一覧</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            カード表示
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4 mr-2" />
            テーブル表示
          </Button>
        </div>
      </div>

      {/* 回答一覧 */}
      {viewMode === 'card' ? (
        <AdminFormAnswerCard
          formAnswers={formAnswers}
          formMaster={formMaster}
          getUserInfo={getUserInfo}
        />
      ) : (
        <AdminFormAnswerTable
          formAnswers={formAnswers}
          formMaster={formMaster}
          getUserInfo={getUserInfo}
        />
      )}
    </div>
  )
}
