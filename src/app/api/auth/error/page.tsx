'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Providers
import { useDialog } from '@/providers/dialog-provider'

// Logic
import * as LocalStorageLogic from '@/logic/local-storage-logic'


export default function ErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const { setErrorDialogData } = useDialog()

  useEffect(() => {
    setErrorDialogData({
      title: 'エラー',
      description: error || 'エラーが発生しました',
      onOk: () => {
        const callbackUrl = LocalStorageLogic.getCallbackUrl()
        LocalStorageLogic.clearCallbackUrl()
        if (callbackUrl) {
          router.replace(callbackUrl)
        } else {
          router.replace('/')
        }
      }
    })
  }, [error, router])

  return null
}