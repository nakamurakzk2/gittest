'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

import * as UserLoginServerLogic from '@/logic/server/user/user-login-server-logic'


export default function PasswordUpdatePage() {
  const searchParams = useSearchParams()
  const [authStatus, setAuthStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const key = searchParams.get('key')

    if (!key) {
      setAuthStatus('error')
      setErrorMessage("URLが無効です")
      return
    }

    const performAuth = async () => {
      try {
        await UserLoginServerLogic.updatePassword(key)
        setAuthStatus('success')
      } catch (error) {
        setAuthStatus('error')
        const message = error instanceof Error ? error.message : '更新に失敗しました。URLが無効または期限切れの可能性があります'
        setErrorMessage(message)
      }
    }

    performAuth()
  }, [searchParams])

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            パスワード更新
          </CardTitle>
          <CardDescription>
            パスワードの更新を行っています。
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {authStatus === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600">
                更新中…
              </p>
            </div>
          )}

          {authStatus === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-800">
                  更新完了
                </h3>
                <p className="text-gray-600">
                  パスワードの更新が正常に完了しました
                </p>
              </div>
            </div>
          )}

          {authStatus === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-800">
                  更新失敗
                </h3>
                <p className="text-gray-600">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
