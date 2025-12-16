// Entity
import { ResponseLink, ResponseTown, ResponseTowns } from "@/entity/response"
import { Town } from "@/entity/town/town"

// Logic
import * as ServerLogic from "@/logic/server-logic"


// =======
// Product
// =======

/**
 * すべての自治体を取得
 */
export const fetchTowns = async (): Promise<ResponseTowns> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/town/towns`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseTowns
  return response
}

/**
 * 自治体を取得
 * @param townId 自治体ID
 * @returns ResponseTown
 */
export const fetchTown = async (townId: string): Promise<ResponseTown> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/town/town`
  const response = await ServerLogic.postWithAccessToken(url, { townId }) as ResponseTown
  return response
}

/**
 * 自治体情報を更新
 * @param town 自治体情報
 */
export const upsertTown = async (town: Town): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/town/upsert-town`
  await ServerLogic.postWithAccessToken(url, { town })
}


/**
 * アップロード用URLを取得
 * @param fileName ファイル名
 * @param contentType コンテンツタイプ
 * @returns ResponseLink
 */
export const fetchImageSignedUrl = async (fileName: string, contentType: string): Promise<ResponseLink> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/town/image-signed-url`
  const response = await ServerLogic.postWithAccessToken(url, { fileName, contentType }) as ResponseLink
  return response
}