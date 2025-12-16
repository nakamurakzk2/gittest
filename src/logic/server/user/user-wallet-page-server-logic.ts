// Entity
import { ResponseMessage, ResponseUserWalletPage } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * ウォレット情報ページに必要な情報を取得
 */
export const fetchWalletPage = async (): Promise<ResponseUserWalletPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/wallet/page`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseUserWalletPage
  return response
}

/**
 * デフォルト送付先アドレスの更新
 * @param walletAddress ウォレットアドレス
 */
export const updateTransferAddress = async (walletAddress: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/wallet/update-transfer-address`
  await ServerLogic.postWithAccessToken(url, { walletAddress })
}

/**
 * 署名メッセージを取得
 * @param walletAddress ウォレットアドレス
 * @returns 署名メッセージ
 */
export const fetchSignMessage = async (walletAddress: string): Promise<ResponseMessage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/wallet/sign-message`
  const response = await ServerLogic.postWithAccessToken(url, { walletAddress }) as ResponseMessage
  return response
}

/**
 * ウォレットを追加
 * @param signature 署名
 * @param walletAddress ウォレットアドレス
 * @param name ウォレット名
 * @param isWeb3Auth Web3Authウォレットかどうか
 */
export const addWallet = async (signature: string, walletAddress: string, name: string, isWeb3Auth: boolean): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/wallet/add-wallet`
  await ServerLogic.postWithAccessToken(url, { signature, walletAddress, name, isWeb3Auth })
}

/**
 * ウォレット名を更新
 * @param walletAddress ウォレットアドレス
 * @param name ウォレット名
 */
export const updateWalletName = async (walletAddress: string, name: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/wallet/update-wallet-name`
  await ServerLogic.postWithAccessToken(url, { walletAddress, name })
}

/**
 * ウォレットを削除
 * @param walletAddress ウォレットアドレス
 */
export const deleteWallet = async (walletAddress: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/wallet/delete-wallet`
  await ServerLogic.postWithAccessToken(url, { walletAddress })
}