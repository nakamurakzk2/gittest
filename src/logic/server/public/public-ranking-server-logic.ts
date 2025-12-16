// Entity
import { ResponseRankingPage } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * ランキングページに必要な情報を取得
 * @returns ResponseRankingPage
 */
export const fetchRankingPage = async (): Promise<ResponseRankingPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/ranking/page`
  const response = await ServerLogic.postWithNoAuth(url) as ResponseRankingPage
  return response
}
