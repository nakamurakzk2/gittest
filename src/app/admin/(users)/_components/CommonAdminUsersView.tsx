"use client"

import { useEffect, useState } from "react"

// Entity
import { AdminUser, AdminUserType } from "@/entity/admin/user"
import { Town } from "@/entity/town/town"
import { Business } from "@/entity/town/business"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { CopyIcon, User, RefreshCw, Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as AdminTownServerLogic from "@/logic/server/admin/admin-town-server-logic"
import * as AdminBusinessServerLogic from "@/logic/server/admin/admin-business-server-logic"
import * as AdminUserServerLogic from "@/logic/server/admin/admin-user-server-logic"

type Props = {
  adminUsers: AdminUser[]
  reload: () => void
  townId?: string | null
}

export default function CommonAdminUsersView({ adminUsers, reload, townId }: Props) {
  const { onFetch } = useDialog()
  const { simpleAdminUser } = useAdminSession()
  const router = useRouter()

  const [towns, setTowns] = useState<Town[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [nextType, setNextType] = useState<AdminUserType | null>(null)
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<AdminUser | null>(null)

  const reloadTownsAndBusinesses = async () => {
    await onFetch(async () => {
      if (townId == null) {
        const { businesses } = await AdminBusinessServerLogic.fetchAllBusinesses()
        const { towns } = await AdminTownServerLogic.fetchTowns()
        setBusinesses(businesses)
        setTowns(towns)
      } else {
        const { businesses } = await AdminBusinessServerLogic.fetchBusinesses(townId)
        const { town } = await AdminTownServerLogic.fetchTown(townId)
        setBusinesses(businesses)
        setTowns([town])
      }
    })
  }

  useEffect(() => {
    reloadTownsAndBusinesses()
  }, [townId])


  const onClickCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "コピーしました",
      description: text,
    })
  }

  const getAdminTypeVariant = (type: AdminUserType) => {
    switch (type) {
      case AdminUserType.ENGINEER:
      case AdminUserType.SUPER_ADMIN:
        return "destructive"
      case AdminUserType.TOWN:
      case AdminUserType.TOWN_VIEWER:
        return "secondary"
      case AdminUserType.BUSINESS:
      case AdminUserType.BUSINESS_VIEWER:
        return "default"
      case AdminUserType.NONE:
      default:
        return "outline"
    }
  }

  const canUpdateAdminType = (currentUserType: AdminUserType, targetUserType: AdminUserType): boolean => {
    const isSuperOrEngineer = currentUserType === AdminUserType.ENGINEER || currentUserType === AdminUserType.SUPER_ADMIN
    const isTown = currentUserType === AdminUserType.TOWN

    if (isSuperOrEngineer) {
      return [AdminUserType.TOWN, AdminUserType.TOWN_VIEWER, AdminUserType.BUSINESS, AdminUserType.BUSINESS_VIEWER].includes(targetUserType)
    }
    if (isTown) {
      return [AdminUserType.BUSINESS, AdminUserType.BUSINESS_VIEWER].includes(targetUserType)
    }
    return false
  }

  const getNextAdminType = (currentType: AdminUserType): AdminUserType | null => {
    switch (currentType) {
      case AdminUserType.TOWN: return AdminUserType.TOWN_VIEWER
      case AdminUserType.TOWN_VIEWER: return AdminUserType.TOWN
      case AdminUserType.BUSINESS: return AdminUserType.BUSINESS_VIEWER
      case AdminUserType.BUSINESS_VIEWER: return AdminUserType.BUSINESS
      default: return null
    }
  }

  const onClickChangeType = (targetUser: AdminUser) => {
    if (!simpleAdminUser) return
    const next = getNextAdminType(targetUser.adminUserType)
    if (!next) return

    setSelectedUser(targetUser)
    setNextType(next)
  }

  const executeChangeType = async () => {
    if (!simpleAdminUser || !selectedUser || !nextType) return

    await onFetch(async () => {
      await AdminUserServerLogic.upsertAdminUser(selectedUser.userId, nextType)
      toast({
        title: "権限を更新しました",
        description: `${CommonLogic.getAdminTypeLabel(selectedUser.adminUserType)} -> ${CommonLogic.getAdminTypeLabel(nextType)}`,
      })
      setSelectedUser(null)
      setNextType(null)
      reload()
    })
  }

  const onClickDelete = (targetUser: AdminUser) => {
    setSelectedUserForDelete(targetUser)
  }

  const executeDelete = async () => {
    if (!selectedUserForDelete) return

    await onFetch(async () => {
      await AdminUserServerLogic.deleteAdminUser(selectedUserForDelete.userId)
      toast({
        title: "管理者を削除しました",
        description: `${selectedUserForDelete.name}を削除しました`,
      })
      setSelectedUserForDelete(null)
      reload()
    })
  }

  const activeUsers = adminUsers.filter(user => !user.deleted)

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">
        管理者一覧
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ユーザー情報</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>所属</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  管理者が見つかりません
                </TableCell>
              </TableRow>
            ) : (
              activeUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getAdminTypeVariant(user.adminUserType)}>
                      {CommonLogic.getAdminTypeLabel(user.adminUserType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {user.townId == null && (
                      <Badge variant="outline">
                        管理者
                      </Badge>
                    )}
                    {user.townId != null && (
                      <Badge variant="outline">
                        {towns.find(town => town.townId === user.townId)?.name.ja}
                      </Badge>
                    )}
                    {user.businessId != null && (
                      <Badge variant="outline">
                        {businesses.find(business => business.businessId === user.businessId)?.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClickCopy(user.userId)}
                        className="flex items-center space-x-1"
                      >
                        <CopyIcon className="h-3 w-3" />
                        <span>ID</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClickCopy(user.email)}
                        className="flex items-center space-x-1"
                      >
                        <CopyIcon className="h-3 w-3" />
                        <span>Email</span>
                      </Button>
                    </div>
                    {simpleAdminUser && canUpdateAdminType(simpleAdminUser.adminUserType, user.adminUserType) && (
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="default" size="sm" className="flex items-center text-xs" onClick={() => onClickChangeType(user)}>
                          <RefreshCw className="h-2 w-2" />
                          <span>権限変更</span>
                        </Button>
                        <Button variant="destructive" size="sm" className="flex items-center text-xs" onClick={() => onClickDelete(user)}>
                          <Trash2Icon className="h-2 w-2" />
                          <span>削除</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>


      <AlertDialog open={selectedUser !== null && nextType !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null)
          setNextType(null)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>権限を変更しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              以下のユーザーの権限を変更します。
            </AlertDialogDescription>
            {selectedUser && nextType && (
              <div className="mt-2 p-4 bg-muted rounded-md space-y-2 text-left">
                <div className="font-medium">{selectedUser.name}</div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={getAdminTypeVariant(selectedUser.adminUserType)}>
                    {CommonLogic.getAdminTypeLabel(selectedUser.adminUserType)}
                  </Badge>
                  <span>→</span>
                  <Badge variant={getAdminTypeVariant(nextType)}>
                    {CommonLogic.getAdminTypeLabel(nextType)}
                  </Badge>
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setSelectedUser(null); setNextType(null) }}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={executeChangeType}>変更する</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={selectedUserForDelete !== null} onOpenChange={(open) => !open && setSelectedUserForDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>管理者を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              以下のユーザーを管理者から削除します。この操作は取り消せません。
            </AlertDialogDescription>
            {selectedUserForDelete && (
              <div className="mt-2 p-4 bg-muted rounded-md space-y-2 text-left">
                <div className="font-medium">{selectedUserForDelete.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedUserForDelete.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={getAdminTypeVariant(selectedUserForDelete.adminUserType)}>
                    {CommonLogic.getAdminTypeLabel(selectedUserForDelete.adminUserType)}
                  </Badge>
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUserForDelete(null)}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">削除する</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}