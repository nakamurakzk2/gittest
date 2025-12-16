"use client"

// Providers
import { useEffect, useState } from "react"

// Entity
import { AdminUser } from "@/entity/admin/user"

// Components
import CommonAdminUsersView from "@/app/admin/(users)/_components/CommonAdminUsersView"

// Logic
import * as AdminUserServerLogic from "@/logic/server/admin/admin-user-server-logic"

// Providers
import { useDialog } from "@/providers/dialog-provider"

type Props = {
  townId: string
}

export default function BusinessUsersView({ townId }: Props) {
  const { onFetch } = useDialog()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])

  const reload = async () => {
    if (townId === '') return
    await onFetch(async () => {
      const { adminUsers } = await AdminUserServerLogic.fetchBusinessUsers(townId)
      setAdminUsers(adminUsers)
    })
  }

  useEffect(() => {
    reload()
  }, [townId])

  return (
    <CommonAdminUsersView
      adminUsers={adminUsers}
      townId={townId}
      reload={reload}
    />
  )
}
