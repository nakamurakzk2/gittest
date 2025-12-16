"use client"

// Providers
import { useEffect, useState } from "react"

// Entity
import { AdminUser } from "@/entity/admin/user"

// Components
import CommonAdminUsersView from "@/app/admin/(users)/_components/CommonAdminUsersView"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { Town } from "@/entity/town/town"

// Logic
import * as AdminUserServerLogic from "@/logic/server/admin/admin-user-server-logic"
import * as AdminTownServerLogic from "@/logic/server/admin/admin-town-server-logic"


export default function TownUsersView() {
  const { onFetch } = useDialog()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [towns, setTowns] = useState<Town[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { adminUsers } = await AdminUserServerLogic.fetchTownUsers()
      const { towns } = await AdminTownServerLogic.fetchTowns()
      setAdminUsers(adminUsers)
      setTowns(towns)
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
