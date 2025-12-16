'use client'

import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from '@/components/hooks/use-toast'

// Providers
import { useDialog } from '@/providers/dialog-provider'
import { useAdminSession } from '@/providers/admin-session-provider'
import { ReCaptchaProvider } from '@/providers/recaptcha-provider'

// Logic
import * as AdminLoginServerLogic from '@/logic/server/admin/admin-login-server-logic'
import { RecaptchaActionType } from '@/entity/admin/audit'

function AdminLoginForm() {
  const { onFetch } = useDialog()
  const { saveSimpleAdminUser } = useAdminSession()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onClickLogin = async () => {
    await onFetch(async () => {
      if (!executeRecaptcha) {
        toast({
          title: 'エラー',
          description: 'reCAPTCHAが初期化されていません。ページを再読み込みしてください。',
          variant: 'destructive',
        })
        return
      }

      let recaptchaToken: string
      try {
        recaptchaToken = await executeRecaptcha(RecaptchaActionType.ADMIN_LOGIN)
      } catch (error) {
        console.error('reCAPTCHA execution error:', error)
        toast({
          title: 'エラー',
          description: 'reCAPTCHAの検証に失敗しました。もう一度お試しください。',
          variant: 'destructive',
        })
        return
      }

      if (!recaptchaToken) {
        toast({
          title: 'エラー',
          description: 'reCAPTCHAトークンの取得に失敗しました。',
          variant: 'destructive',
        })
        return
      }

      const { simpleAdminUser } = await AdminLoginServerLogic.login(email, password, recaptchaToken)
      saveSimpleAdminUser(simpleAdminUser)
      toast({
        title: 'ログインしました',
      })
    })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onClickLogin()
  }

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    toast({
      title: 'パスワードリセットメールを送信しました',
    })
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">管理者ログイン</CardTitle>
          <CardDescription>
            アカウントにログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">メールアドレス</Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">パスワード</Label>
              <Input
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              ログイン
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full text-sm"
              onClick={handleForgotPassword}
            >
              パスワードをお忘れの方はこちら
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminLoginView() {
  return (
    <ReCaptchaProvider>
      <AdminLoginForm />
    </ReCaptchaProvider>
  )
}