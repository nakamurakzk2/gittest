// Entity
import { ResponseUserEditPage } from "@/entity/response"
import { BillingInfo } from "@/entity/user/user"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * アカウント情報編集ページに必要な情報を取得
 */
export const fetchEditPage = async (): Promise<ResponseUserEditPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/edit/page`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseUserEditPage
  return response
}

/**
 * メールアドレスを更新
 * @param email メールアドレス
 * @param password パスワード
 */
export const updateEmail = async (email: string, password: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/edit/update-email`
  await ServerLogic.postWithAccessToken(url, { email, password })
}

/**
 * パスワードを更新
 * @param password 現在のパスワード
 * @param newPassword 新しいパスワード
 */
export const updatePassword = async (password: string, newPassword: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/edit/update-password`
  await ServerLogic.postWithAccessToken(url, { password, newPassword })
}

/**
 * 請求先住所を更新
 * @param billingInfo 請求先住所
 */
export const updateBillingInfo = async (billingInfo: BillingInfo): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/edit/update-billing-info`
  await ServerLogic.postWithAccessToken(url, { billingInfo })
}


/**
 * ユーザを削除
 */
export const deleteUser = async (): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/edit/delete-account`
  await ServerLogic.postWithAccessToken(url)
}