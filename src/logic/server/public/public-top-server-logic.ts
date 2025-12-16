// Entity
import { ResponseTopPage } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * トップページに必要な情報を取得
 * @returns ResponseTopPage
 */
export const fetchTopPage = async (): Promise<ResponseTopPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/top/page`
  const response = await ServerLogic.postWithNoAuth(url) as ResponseTopPage
  return response
}
