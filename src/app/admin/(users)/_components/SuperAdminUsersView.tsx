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


export default function SuperAdminUsersView() {
  const { onFetch } = useDialog()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { adminUsers } = await AdminUserServerLogic.fetchSuperAdminUsers()
      setAdminUsers(adminUsers)
    })
  }

  useEffect(() => {
    reload()
  }, [])

  return (
    <CommonAdminUsersView
      adminUsers={adminUsers}
      reload={reload}
    />
  )
}
