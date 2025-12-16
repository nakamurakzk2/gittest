"use client"

import { CheckIcon, XIcon, Mail, User } from "lucide-react"

// Providers
import { toast } from "@/components/hooks/use-toast"

// Entity
import { SuperAdminApplication } from "@/entity/admin/user-application"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { useEffect, useState } from "react"

// Logic
import * as AdminApplicationServerLogic from "@/logic/server/admin/admin-application-server-logic"

export default function SuperAdminApplicationsView() {
  const { onFetch } = useDialog()
  const [ superAdminApplications, setSuperAdminApplications ] = useState<SuperAdminApplication[]>([])

  const reload = async () => {
    const { superAdminApplications } = await AdminApplicationServerLogic.fetchSuperAdminApplications()
    setSuperAdminApplications(superAdminApplications)
  }

  useEffect(() => {
    reload()
  }, [])

  /**
   * 申請を承認
   * @param userId ユーザーID
   */
  const onClickApprove = async (userId: string) => {
    await onFetch(async () => {
      await AdminApplicationServerLogic.approveSuperAdminApplication(userId)
      toast({
        title: "申請を承認しました",
        description: `ユーザーID: ${userId}`,
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
      await AdminApplicationServerLogic.rejectSuperAdminApplication(userId)
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {superAdminApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  申請が見つかりません
                </TableCell>
              </TableRow>
            ) : (
              superAdminApplications.map((application) => (
                <TableRow key={application.userId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{application.name}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {application.email}
                        </div>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClickApprove(application.userId)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                      >
                        <CheckIcon className="h-3 w-3" />
                        <span>承認</span>
                      </Button>
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