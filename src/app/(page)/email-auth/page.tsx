'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authorize } from '@/logic/server/user/user-login-server-logic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useLanguageSession } from '@/providers/language-provider'
import { LANGUAGE_LIST } from '@/define/language'

import * as LocalStorageLogic from '@/logic/local-storage-logic'

export default function EmailAuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getLocalizedText } = useLanguageSession()
  const [authStatus, setAuthStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const key = searchParams.get('key')

    if (!key) {
      setAuthStatus('error')
      setErrorMessage(getLocalizedText(LANGUAGE_LIST.AuthenticationKeyNotFound))
      return
    }

    const performAuth = async () => {
      const callbackUrl = searchParams.get('callbackUrl')
      try {
        await authorize(key)
        setAuthStatus('success')
        if (callbackUrl) {
          LocalStorageLogic.saveCallbackUrl(callbackUrl)
        }
        router.push('/login')
      } catch (error) {
        const message = error instanceof Error ? error.message : getLocalizedText(LANGUAGE_LIST.AuthenticationFailedMessage)
        setAuthStatus('error')
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
            {getLocalizedText(LANGUAGE_LIST.EmailAuthentication)}
          </CardTitle>
          <CardDescription>
            {getLocalizedText(LANGUAGE_LIST.EmailAuthenticationDescription)}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {authStatus === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600">
                {getLocalizedText(LANGUAGE_LIST.Authenticating)}
              </p>
            </div>
          )}

          {authStatus === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-800">
                  {getLocalizedText(LANGUAGE_LIST.AuthenticationCompleted)}
                </h3>
                <p className="text-gray-600">
                  {getLocalizedText(LANGUAGE_LIST.AuthenticationCompletedMessage)}
                </p>
                <p className="text-sm text-gray-500">
                  {getLocalizedText(LANGUAGE_LIST.AuthenticationCompletedInstruction)}
                </p>
              </div>
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                {getLocalizedText(LANGUAGE_LIST.GoToLoginScreen)}
              </Button>
            </div>
          )}

          {authStatus === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-800">
                  {getLocalizedText(LANGUAGE_LIST.AuthenticationFailed)}
                </h3>
                <p className="text-gray-600">
                  {errorMessage}
                </p>
                {/*
                <p className="text-sm text-gray-500">
                  {getLocalizedText(LANGUAGE_LIST.AuthenticationFailedInstruction)}
                </p>
                */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
