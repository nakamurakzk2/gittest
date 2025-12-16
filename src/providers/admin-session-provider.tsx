'use client'

import { SESSION_KEY } from '@/define/login'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Entity
import { SimpleAdminUser } from '@/entity/admin/user'
import { SimpleTown } from '@/entity/town/town'

// Component
import { useDisconnect } from '@reown/appkit/react'
import { useDialog } from '@/providers/dialog-provider'

// Logic
import * as AdminLoginServerLogic from '@/logic/server/admin/admin-login-server-logic'
import * as PublicTownServerLogic from '@/logic/server/public/public-town-server-logic'

export type AdminSessionInfo = {
  loading: boolean
  simpleAdminUser: SimpleAdminUser | null
  simpleTowns: SimpleTown[]
  townId: string
  setTownId: (townId: string) => void
  businessId: string
  setBusinessId: (businessId: string) => void
  reload: () => Promise<void>
  saveSimpleAdminUser: (simpleAdminUser: SimpleAdminUser) => void
  logout: () => void
}

export const AdminSessionContext = createContext<AdminSessionInfo>({
  loading: false,
  simpleAdminUser: null,
  simpleTowns: [],
  townId: "",
  setTownId: () => { },
  businessId: "",
  setBusinessId: () => { },
  reload: async () => { },
  saveSimpleAdminUser: () => { },
  logout: () => { },
})

export const useAdminSession = () => {
  const context = useContext(AdminSessionContext)
  if (!context) {
    throw new Error('useAdminSession must be used within a AdminSessionProvider')
  }
  return context
}

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { showLoading, hideLoading } = useDialog()
  const { disconnect } = useDisconnect()

  const [loading, setLoading] = useState(true)
  const [simpleAdminUser, setSimpleAdminUser] = useState<SimpleAdminUser | null>(null)
  const [simpleTowns, setSimpleTowns] = useState<SimpleTown[]>([])
  const [townId, setTownId] = useState<string>("")
  const [businessId, setBusinessId] = useState<string>("")

  const reload = async () => {
    setLoading(true)
    try {
      const { simpleAdminUser } = await AdminLoginServerLogic.refresh()
      saveSimpleAdminUser(simpleAdminUser)
    } catch (e) {
      // トークンがない場合やリフレッシュに失敗した場合は、simpleAdminUserをnullにする
      setSimpleAdminUser(null)
    }
    setLoading(false)
  }

  const reloadSimpleTowns = async () => {
    if (simpleAdminUser == null) return
    try {
      const { simpleTowns } = await PublicTownServerLogic.fetchSimpleTowns()
      setSimpleTowns(simpleTowns)
    } catch (e) {
    }
  }

  /**
   * ログインセッションを保存する
   * @param loginSession ログインセッション
   */
  const saveSimpleAdminUser = (simpleAdminUser: SimpleAdminUser) => {
    setSimpleAdminUser(simpleAdminUser)
    // localStorage.setItem(SESSION_KEY.ADMIN, adminLoginSession.sessionKey)
  }

  const logout = async () => {
    // localStorage.removeItem(SESSION_KEY.ADMIN)
    setSimpleAdminUser(null)
    setTownId("")
    setBusinessId("")
    disconnect()
    await AdminLoginServerLogic.logout()
    router.push('/admin')
  }

  useEffect(() => {
    reloadSimpleTowns()
  }, [simpleAdminUser])


  useEffect(() => {
    if (simpleAdminUser == null || simpleAdminUser.businessId == null) return
    setBusinessId(simpleAdminUser.businessId)
  }, [simpleAdminUser, setBusinessId])

  useEffect(() => {
    if (simpleAdminUser == null || simpleAdminUser.townId == null) return
    setTownId(simpleAdminUser.townId)
  }, [simpleAdminUser, setTownId])


  // townIdが変更されたときにbusinessIdをリセット
  useEffect(() => {
    setBusinessId("")
  }, [townId])

  useEffect(() => {
    reload()
    // eslint-disable-next-line
  }, [])

  return (
    <AdminSessionContext.Provider value={{ loading, simpleAdminUser, simpleTowns, townId, setTownId, businessId, setBusinessId, reload, saveSimpleAdminUser, logout }}>
      {children}
    </AdminSessionContext.Provider>
  )
}