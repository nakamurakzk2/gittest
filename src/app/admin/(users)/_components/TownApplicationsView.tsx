"use client"

import { useEffect, useState } from "react"
import { CheckIcon, XIcon, Mail, User, ChevronDown } from "lucide-react"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { TownApplication } from "@/entity/admin/user-application"
import { Town } from "@/entity/town/town"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as AdminApplicationServerLogic from "@/logic/server/admin/admin-application-server-logic"
import { Badge } from "@/components/ui/badge"


export default function TownApplicationsView() {
  const { onFetch } = useDialog()
  const [ townApplications, setTownApplications ] = useState<TownApplication[]>([])
  const [ towns, setTowns ] = useState<Town[]>([])

  const reload = async () => {
    const { townApplications, towns } = await AdminApplicationServerLogic.fetchTownApplications()
    setTownApplications(townApplications)
    setTowns(towns)
  }

  useEffect(() => {
    reload()
  }, [])

  /**
   * 申請を承認
   * @param userId ユーザーID
   * @param adminUserType 管理者タイプ
   */
  const onClickApprove = async (userId: string, adminUserType: AdminUserType) => {
    await onFetch(async () => {
      await AdminApplicationServerLogic.approveTownApplication(userId, adminUserType)
      const typeLabel = adminUserType === AdminUserType.TOWN ? "自治体管理者" : "自治体閲覧者"
      toast({
        title: "申請を承認しました",
        description: `ユーザーID: ${userId} (${typeLabel})`,
      })
      await reload()
    })
  }

  /**
   * 申請を却下
   * @param userId ユーザーID
   */
  const onClickReject = async (userId: string) => {
    await onFetch(async () => {
      await AdminApplicationServerLogic.rejectTownApplication(userId)
      toast({
        title: "申請を却下しました",
        description: `ユーザーID: ${userId}`,
      })
      await reload()
    })
  }

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">
        申請状況
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>申請者情報</TableHead>
              <TableHead>申請日時</TableHead>
              <TableHead className="text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {townApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  申請が見つかりません
                </TableCell>
              </TableRow>
            ) : (
              townApplications.map((application) => (
                <TableRow key={application.userId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <Badge variant="outline">
                          {towns.find(town => town.townId === application.townId)?.name.ja}
                        </Badge>
                        <div className="font-medium">{application.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(application.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(application.createdAt).toLocaleTimeString('ja-JP')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                          >
                            <CheckIcon className="h-3 w-3" />
                            <span>承認</span>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onClickApprove(application.userId, AdminUserType.TOWN)}
                          >
                            自治体管理者として承認
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onClickApprove(application.userId, AdminUserType.TOWN_VIEWER)}
                          >
                            自治体閲覧者として承認
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClickReject(application.userId)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <XIcon className="h-3 w-3" />
                        <span>拒否</span>
                      </Button>
                    </div>
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