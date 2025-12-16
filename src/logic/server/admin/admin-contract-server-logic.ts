// Entity
import { Attribute, Collection } from "@/entity/product/contract"
import { ResponseCollection, ResponseCollectionDraft } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


// ==========
// Collection
// ==========

/**
 * コレクションを取得
 * @param productId 商品ID
 * @returns ResponseCollection
 */
export const fetchCollection = async (productId: string): Promise<ResponseCollection> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/contract/collection`
  const response = await ServerLogic.postWithAccessToken(url, { productId }) as ResponseCollection
  return response
}

/**
 * コレクションを作成
 * @param productId 商品ID
 * @param chainId チェーンID
 * @param name コレクション名
 * @param symbol コレクションシンボル
 * @param image コレクション画像
 * @param title コレクションタイトル
 * @param description コレクション説明
 * @param attributes コレクション属性
 */
export const createCollection = async (productId: string, chainId: number, name: string, symbol: string, image: string, title: string, description: string, attributes: Attribute[]): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/contract/create-collection`
  await ServerLogic.postWithAccessToken(url, { productId, chainId, name, symbol, image, title, description, attributes })
}


/**
 * コレクションを更新
 * @param collection コレクション情報
 */
export const updateCollection = async (collection: Collection): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/contract/update-collection`
  await ServerLogic.postWithAccessToken(url, { collection })
}


// ===============
// CollectionDraft
// ===============


/**
 * コレクション下書きを作成
 * @param productId 商品ID
 * @param chainId チェーンID
 * @param name コレクション名
 * @param symbol コレクションシンボル
 * @param image コレクション画像
 * @param title コレクションタイトル
 * @param description コレクション説明
 * @param attributes コレクション属性
 */
export const createCollectionDraft = async (productId: string, chainId: number, name: string, symbol: string, image: string, title: string, description: string, attributes: Attribute[]): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/contract/create-collection-draft`
  await ServerLogic.postWithAccessToken(url, { productId, chainId, name, symbol, image, title, description, attributes })
}


/**
 * コレクション下書きを取得
 * @param productId 商品ID
 * @returns ResponseCollection
 */
export const fetchCollectionDraft = async (productId: string): Promise<ResponseCollectionDraft> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/contract/collection-draft`
  const response = await ServerLogic.postWithAccessToken(url, { productId }) as ResponseCollectionDraft
  return response
}
