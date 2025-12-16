// Entity
import { ResponseFeaturePage } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * 特集ページに必要な情報を取得
 * @returns ResponseFeaturePage
 */
export const fetchFeaturePage = async (): Promise<ResponseFeaturePage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/feature/page`
  const response = await ServerLogic.postWithNoAuth(url) as ResponseFeaturePage
  return response
}
