"use client"

import { useEffect, useMemo, useState } from "react"
import { UserPlus, Eye, EyeOff } from "lucide-react"

// Providers
import { toast } from "@/components/hooks/use-toast"

// Entity
import { SimpleTown } from "@/entity/town/town"

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as AdminApplicationServerLogic from '@/logic/server/admin/admin-application-server-logic'
import * as PublicTownServerLogic from '@/logic/server/public/public-town-server-logic'

export default function TownApplicationForm() {
  const { onFetch } = useDialog()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [simpleTowns, setSimpleTowns] = useState<SimpleTown[]>([])

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [townId, setTownId] = useState('')

  const reload = async () => {
    await onFetch(async () => {
      const { simpleTowns } = await PublicTownServerLogic.fetchSimpleTowns()
      setSimpleTowns(simpleTowns)
    })
  }

  useEffect(() => {
    reload()
  }, [])


  const isValidEmail = useMemo(() => {
    return email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
  }, [email])

  const confirmPasswordIsCorrect = useMemo(() => {
    return password === confirmPassword
  }, [password, confirmPassword])

  const canSubmit = useMemo(() => {
    return (name.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      phoneNumber.length > 0 &&
      townId.length > 0 &&
      isValidEmail &&
      confirmPasswordIsCorrect
    )
  }, [isValidEmail, name, password, confirmPassword, phoneNumber, townId])

  const resetForm = () => {
    setEmail('')
    setName('')
    setPassword('')
    setConfirmPassword('')
    setPhoneNumber('')
    setTownId('')
  }

  const onClickSubmit = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "エラー",
        description: "パスワードが一致しません",
        variant: "destructive",
      })
      return
    }

    await onFetch(async () => {
      await AdminApplicationServerLogic.applyTown(email, name, phoneNumber, townId, password)
      toast({
        title: "お知らせ",
        description: "自治体アカウントの申請が完了しました",
        duration: 3000
      })
      resetForm()
    })
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">自治体アカウント作成</CardTitle>
          <CardDescription>
            自治体アカウントを作成します。すべての項目を入力して申請してください。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* メールアドレス */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                メールアドレス <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {email.length > 0 && !isValidEmail && (
                <p className="text-sm text-red-500 mt-1">正しいメールアドレス形式で入力してください</p>
              )}
            </div>
            {/* パスワード */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                パスワード <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {/* パスワード（確認用） */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                パスワード（確認用） <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !confirmPasswordIsCorrect && (
                <p className="text-sm text-red-500 mt-1">パスワードが一致しません</p>
              )}
            </div>
            {/* 名前 */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                名前 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="山田 太郎"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            {/* 電話番号 */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                電話番号 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </div>
            {/* 自治体 */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                自治体 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={townId}
                onValueChange={(value) => setTownId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="自治体を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {simpleTowns.map((simpleTown) => (
                    <SelectItem key={simpleTown.townId} value={simpleTown.townId}>
                      {simpleTown.name.ja}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="pt-4">
            <Button className="w-full" size="lg" disabled={!canSubmit} onClick={() => onClickSubmit()}>
              自治体アカウント作成を申請
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
