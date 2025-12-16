// Entity
import { ResponseSearchPage } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * 検索ページに必要な情報を取得
 * @return ResponseSearchPage
 */
export const fetchSearchPage = async (): Promise<ResponseSearchPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/search/page`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseSearchPage
  return response
}
