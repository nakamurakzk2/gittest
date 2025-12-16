// Entity
import { Business } from "@/entity/town/business"
import { ResponseBusiness, ResponseBusinesses } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * すべての事業者一覧を取得
 * @returns ResponseBusinesses
 */
export const fetchAllBusinesses = async (): Promise<ResponseBusinesses> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/business/all-businesses`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseBusinesses
  return response
}


/**
 * 事業者一覧を取得
 * @param townId 自治体ID
 * @returns ResponseBusinesses
 */
export const fetchBusinesses = async (townId: string): Promise<ResponseBusinesses> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/business/businesses`
  const response = await ServerLogic.postWithAccessToken(url, { townId }) as ResponseBusinesses
  return response
}

/**
 * 事業者を取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @returns ResponseBusiness
 */
export const fetchBusiness = async (townId: string, businessId: string): Promise<ResponseBusiness> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/business/business`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponseBusiness
  return response
}

/**
 * 事業者を更新
 * @param business 事業者
 */
export const upsertBusiness = async (business: Business): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/business/upsert-business`
  await ServerLogic.postWithAccessToken(url, { business })
}