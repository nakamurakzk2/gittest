"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { Business } from "@/entity/town/business"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"

// Logic
import * as AdminBusinessServerLogic from "@/logic/server/admin/admin-business-server-logic"

type Props = {
  townId: string
}

export default function BusinessesView({ townId }: Props) {
  const { onFetch } = useDialog()

  const [businesses, setBusinesses] = useState<Business[]>([])

  const reload = async () => {
    if (townId === "") return
    await onFetch(async () => {
      const { businesses } = await AdminBusinessServerLogic.fetchBusinesses(townId)
      setBusinesses(businesses)
    })
  }

  useEffect(() => {
    reload()
  }, [townId])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {businesses.length} 件の事業者
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/businesses/create">
            <Plus className="h-4 w-4" />
            新規登録
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>事業者名</TableHead>
              <TableHead>説明</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  事業者が見つかりません
                </TableCell>
              </TableRow>
            ) : (
              businesses.map((business) => (
                <TableRow key={business.businessId}>
                  <TableCell className="font-medium">
                    {business.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {business.description.ja}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/businesses/${business.businessId}/edit`} className="flex items-center space-x-1">
                        <Edit className="h-3 w-3" />
                        <span>編集</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}