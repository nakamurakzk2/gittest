// Entity
import { ResponseSimpleTowns, ResponseTownPage, ResponseTownsPage } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * 自治体ページに必要な情報を取得
 * @returns ResponseTownPage
 */
export const fetchTownsPage = async (): Promise<ResponseTownsPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/town/towns-page`
  const response = await ServerLogic.postWithNoAuth(url) as ResponseTownsPage
  return response
}

/**
 * 自治体ページに必要な情報を取得
 * @param townId 自治体ID
 * @returns ResponseTownPage
 */
export const fetchTownPage = async (townId: string): Promise<ResponseTownPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/town/town-page`
  const response = await ServerLogic.postWithNoAuth(url, { townId }) as ResponseTownPage
  return response
}

/**
 * シンプル自治体リストを取得
 * @returns ResponseSimpleTowns
 */
export const fetchSimpleTowns = async (): Promise<ResponseSimpleTowns> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/town/simple-towns`
  const response = await ServerLogic.postWithNoAuth(url) as ResponseSimpleTowns
  return response
}
