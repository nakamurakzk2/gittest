'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Entity
import { SimpleUser } from '@/entity/user/user'

// Component
import { useDialog } from '@/providers/dialog-provider'

// Provider
import { toast } from '@/components/hooks/use-toast'

// Logic
import * as UserLoginServerLogic from '@/logic/server/user/user-login-server-logic'

export type UserSessionInfo = {
  loading: boolean
  simpleUser: SimpleUser | null
  reload: () => Promise<void>
  saveSimpleUser: (simpleUser: SimpleUser) => void
  logout: () => void
}

export const UserSessionContext = createContext<UserSessionInfo>({
  loading: false,
  simpleUser: null,
  reload: async () => {},
  saveSimpleUser: () => {},
  logout: () => {},
})

export const useUserSession = () => {
  const context = useContext(UserSessionContext)
  if (!context) {
    throw new Error('useUserSession must be used within a UserSessionProvider')
  }
  return context
}

export function UserSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { onFetch, showLoading, hideLoading } = useDialog()

  const [ loading, setLoading ] = useState(true)
  const [ simpleUser, setSimpleUser ] = useState<SimpleUser | null>(null)

  const reload = async () => {
    setLoading(true)
    try {
      const { simpleUser } = await UserLoginServerLogic.refresh()
      saveSimpleUser(simpleUser)
    } catch(e){
      // トークンがない場合やリフレッシュに失敗した場合は、simpleUserをnullにする
      setSimpleUser(null)
    }
    setLoading(false)
  }

  /**
   * ログインセッションを保存する
   * @param loginSession ログインセッション
   */
  const saveSimpleUser = (simpleUser: SimpleUser) => {
    setSimpleUser(simpleUser)
    // localStorage.setItem(SESSION_KEY.ADMIN, adminLoginSession.sessionKey)
  }

  const logout = async () => {
    // localStorage.removeItem(SESSION_KEY.ADMIN)
    await onFetch(async () => {
      await UserLoginServerLogic.logout()
      setSimpleUser(null)
      toast({
        title: 'ログアウトしました',
      })
    })
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line
  }, [])



  return (
    <UserSessionContext.Provider value={{loading, simpleUser, reload, saveSimpleUser, logout}}>
      {children}
    </UserSessionContext.Provider>
  )
}