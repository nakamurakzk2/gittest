"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

// Entity
import { BillingInfo } from "@/entity/user/user"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import BlueButton from "@/components/BlueButton"
import UpdateEmailView from "./_components/UpdateEmailView"
import UpdatePasswordView from "./_components/UpdatePasswordView"
import BillingInfoView from "./_components/BillingInfoView"
import UpdateBillingInfoView from "./_components/UpdateBillingInfoView"
import DeleteAccountView from "./_components/DeleteAccountView"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as UserEditPageServerLogic from "@/logic/server/user/user-edit-page-server-logic"

// Constants
import { getBackgroundClass } from "@/define/colors"

export default function AccountEditPage() {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [ isGoogleLogin, setIsGoogleLogin ] = useState<boolean>(false)
  const [ billingInfo, setBillingInfo ] = useState<BillingInfo | null>(null)
  const [ email, setEmail ] = useState<string | null>(null)
  const [ editingBillingInfo, setEditingBillingInfo ] = useState<boolean>(false)


  const reload = async () => {
    await onFetch(async () => {
      const { isGoogleLogin, billingInfo, email } = await UserEditPageServerLogic.fetchEditPage()
      setIsGoogleLogin(isGoogleLogin)
      setBillingInfo(billingInfo)
      setEmail(email)
    })
  }

  useEffect(() => {
    reload()
  }, [router])

  const onClickEditBillingInfo = () => {
    setEditingBillingInfo(true)
  }

  const onCancelBillingInfo = () => {
    setEditingBillingInfo(false)
  }

  const onSaveBillingInfo = () => {
    setEditingBillingInfo(false)
    reload()
  }


  return (
    <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
      <div className="px-6 py-6 max-w-6xl mx-auto">
        {/* パンくずリスト */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">ホーム</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account">アカウント</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>アカウント情報の編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          アカウント情報の編集
        </h1>

        <div className="space-y-16">
          {!isGoogleLogin && (
            <UpdateEmailView email={email} />
          )}
          {!isGoogleLogin && (
            <UpdatePasswordView />
          )}
          {editingBillingInfo && (
            <UpdateBillingInfoView
              billingInfo={billingInfo}
              onSave={onSaveBillingInfo}
              onCancel={onCancelBillingInfo}
            />
          )}
          {!editingBillingInfo && (<div>
            <BillingInfoView billingInfo={billingInfo} />
            <div className="mt-6 flex justify-start">
              <div>
                <BlueButton onClick={onClickEditBillingInfo}>
                  編集する
                </BlueButton>
              </div>
            </div>
          </div>)}

          <DeleteAccountView />
        </div>
      </div>
    </div>
  )
}
