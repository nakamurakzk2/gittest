"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { Town } from "@/entity/town/town"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"

// Logic
import * as AdminTownServerLogic from "@/logic/server/admin/admin-town-server-logic"

export default function TownsView() {
  const { onFetch } = useDialog()

  const [towns, setTowns] = useState<Town[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { towns } = await AdminTownServerLogic.fetchTowns()
      setTowns(towns)
    })
  }

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {towns.length} 件の自治体
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/towns/create">
            <Plus className="h-4 w-4" />
            新規登録
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>自治体名</TableHead>
              <TableHead>説明</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {towns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  事業者が見つかりません
                </TableCell>
              </TableRow>
            ) : (
              towns.map((town) => (
                <TableRow key={town.townId}>
                  <TableCell className="font-medium">
                    {town.name.ja}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {town.description.ja}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/towns/${town.townId}/edit`} className="flex items-center space-x-1">
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