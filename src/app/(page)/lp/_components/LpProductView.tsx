"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { LANGUAGE_LIST } from "@/define/language"

// Entity
import { SimpleProductGroup, SimpleProductItem, SimpleProductCategory } from "@/entity/product/product"
import { SimpleBusiness } from "@/entity/town/business"
import { SimpleTown } from "@/entity/town/town"
import { UserFormData } from "@/entity/user/user"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { useLanguageSession } from "@/providers/language-provider"
import { useUserSession } from "@/providers/user-session-provider"
import { ReCaptchaProvider } from "@/providers/recaptcha-provider"
import { toast } from "@/components/hooks/use-toast"

// Hooks
import { useAfterLoginProcess } from "@/hooks/use-after-login-process"

// Components
import LpSignUpFormView from "@/app/(page)/lp/_components/LpSignUpFormView"
import LpSimpleProductView from "@/app/(page)/lp/_components/LpSimpleProductView"

// Logic
import * as LocalStorageLogic from "@/logic/local-storage-logic"
import * as UserLoginServerLogic from "@/logic/server/user/user-login-server-logic"
import * as ProductPublicServerLogic from "@/logic/server/product/product-public-server-logic"

// Define
import { RecaptchaActionType } from "@/entity/admin/audit"


type Props = {
  productGroupId: string
  productId: string
}

function LpProductForm({productGroupId, productId}: Props) {
  const { simpleUser } = useUserSession()
  const { onFetch } = useDialog()
  const { getLocalizedText } = useLanguageSession()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [amount, setAmount] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState(productId)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  // Googleログイン後の処理
  useAfterLoginProcess()

  const [simpleProductGroup, setSimpleProductGroup] = useState<SimpleProductGroup | null>(null)
  const [simpleProductItems, setSimpleProductItems] = useState<SimpleProductItem[]>([])
  const [simpleProductCategories, setSimpleProductCategories] = useState<SimpleProductCategory[]>([])
  const [simpleBusiness, setSimpleBusiness] = useState<SimpleBusiness | null>(null)
  const [simpleTown, setSimpleTown] = useState<SimpleTown | null>(null)

  const purchaseSectionRef = useRef<HTMLDivElement>(null)


  const reload = async () => {
    await onFetch(async () => {
      const { simpleProductGroup, simpleProductItems, simpleProductCategories, simpleBusiness, simpleTown } = await ProductPublicServerLogic.fetchSimpleProduct(productGroupId)
      setSimpleProductGroup(simpleProductGroup)
      setSimpleProductItems(simpleProductItems)
      setSimpleProductCategories(simpleProductCategories)
      setSimpleBusiness(simpleBusiness)
      setSimpleTown(simpleTown)
    })
  }

  useEffect(() => {
    reload()
  }, [productGroupId, productId])


  useEffect(() => {
    LocalStorageLogic.saveCallbackUrl(`/product/payment?productId=${productId}&amount=${amount}`)
  }, [amount, selectedProductId])

  /**
   * URLハッシュが#section-purchaseに変化したときにスクロール
   */
  useEffect(() => {
    const scrollToPurchaseSection = () => {
      if (window.location.hash === '#section-purchase' && purchaseSectionRef.current) {
        const header = document.querySelector('.site-header')
        const getOffset = () => (header ? (header as HTMLElement).offsetHeight : 0)
        const duration = 800
        // easeOutCubic: より自然な減速感のあるイージング
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

        const startY = window.pageYOffset
        const targetRect = purchaseSectionRef.current.getBoundingClientRect()
        const offset = getOffset()
        const targetY = targetRect.top + startY - offset

        let startTime: number | null = null
        const step = (timestamp: number) => {
          if (startTime === null) startTime = timestamp
          const elapsed = timestamp - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = easeOutCubic(progress)
          window.scrollTo(0, startY + (targetY - startY) * eased)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }

    // 初回レンダリング時にもチェック
    scrollToPurchaseSection()

    // ハッシュ変更を監視
    const handleHashChange = () => {
      scrollToPurchaseSection()
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [simpleProductGroup])

  /**
   * アカウント登録処理
   */
  const onClickSignUp = async (formData: UserFormData) => {
    if (formData == null) return
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
        recaptchaToken = await executeRecaptcha(RecaptchaActionType.USER_SIGNUP)
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

      const callbackUrl = `/product/payment?productId=${productId}&amount=${amount}`
      await UserLoginServerLogic.signup(formData, callbackUrl, recaptchaToken)
      setShowEmailConfirmation(true)
    })
  }

  if (simpleProductGroup == null || simpleProductItems == null || simpleProductCategories == null || simpleBusiness == null || simpleTown == null) {
    return <div>Loading...</div>
  }


  return (
    <div>
      <div className="my-10" id="section-purchase" ref={purchaseSectionRef}>
        <LpSimpleProductView
          productGroup={simpleProductGroup}
          productItems={simpleProductItems}
          productCategories={simpleProductCategories}
          business={simpleBusiness}
          town={simpleTown}
          amount={amount}
          setAmount={setAmount}
          selectedProductId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
        />
      </div>
      {simpleUser == null && (
        <div className="bg-[#685191] py-10 px-4 md:px-8">
          {!showEmailConfirmation ? (
            <>
              <div className="text-white text-center text-lg md:text-xl font-bold my-10">
                TOKKEN新規アカウントのご登録と商品の購入はこちらから
              </div>
              <div className="text-white text-center text-xs md:text-base my-10">
                <div>アカウントの登録後、登録完了メールが届きます。</div>
                <div>登録完了メールからログインして商品をご購入ください。</div>
              </div>
              <LpSignUpFormView
                onNext={onClickSignUp}
              />
            </>
          ) : (
            <div className="w-full max-w-4xl mx-auto py-8 px-8 bg-white rounded-lg">
              <div className="text-center space-y-6">
                <div className="text-2xl font-bold text-gray-900">
                  {getLocalizedText(LANGUAGE_LIST.AccountCreatedTitle)}
                </div>
                <div className="text-sm md:text-base text-gray-700 space-y-4">
                  <p>{getLocalizedText(LANGUAGE_LIST.AccountCreated)}</p>
                </div>
                <div className="text-xs md:text-sm text-gray-600 pt-4">
                  <p>認証完了後、ログインして商品をご購入いただけます。</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function LpProductView({productGroupId, productId}: Props) {
  return (
    <ReCaptchaProvider>
      <LpProductForm productGroupId={productGroupId} productId={productId} />
    </ReCaptchaProvider>
  )
}
