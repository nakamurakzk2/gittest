// Entity
import { Attribute } from "@/entity/product/contract"
import { AdminProductStatus, ProductCategory, ProductItem } from "@/entity/product/product"
import { ResponseLink, ResponseOwnProduct, ResponseOwnProducts, ResponseProductCategories, ResponseProductCategory, ResponseProductItem, ResponseProductItems, ResponseProducts, ResponseSimpleProduct } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


// =======
// Product
// =======

/**
 * 商品情報を取得
 * @param townId 自治体ID
 */
export const fetchProducts = async (townId: string): Promise<ResponseProducts> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/products`
  const response = await ServerLogic.postWithAccessToken(url, { townId }) as ResponseProducts
  return response
}

/**
 * 商品アイテムを取得
 * @param productId 商品ID
 * @returns ResponseProductItem
 */
export const fetchProductItem = async (productId: string): Promise<ResponseProductItem> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/product-item`
  const response = await ServerLogic.postWithAccessToken(url, { productId }) as ResponseProductItem
  return response
}

/**
 * グループ内の商品アイテムを取得
 * @param productGroupId 商品グループID
 * @returns ResponseProductItems
 */
export const fetchProductItems = async (productGroupId: string): Promise<ResponseProductItems> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/product-items`
  const response = await ServerLogic.postWithAccessToken(url, { productGroupId }) as ResponseProductItems
  return response
}

/**
 * プレビュー用の商品情報を取得
 * @param productGroupId 商品グループID
 * @returns ResponseSimpleProduct
 */
export const fetchSimpleProductForPreview = async (productGroupId: string): Promise<ResponseSimpleProduct> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/simple-product-for-preview`
  const response = await ServerLogic.postWithAccessToken(url, { productGroupId }) as ResponseSimpleProduct
  return response
}

/**
 * 商品グループを作成
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @param productItems 商品情報
 * @returns
 */
export const insertProductGroup = async (townId: string, businessId: string, productItems: ProductItem[]): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/insert-product-group`
  await ServerLogic.postWithAccessToken(url, { townId, businessId, productItems })
}

/**
 * 商品グループを更新
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @param productGroupId 商品グループID
 * @param productItems 商品情報
 * @returns
 */
export const updateProductGroup = async (townId: string, businessId: string, productGroupId: string, productItems: ProductItem[]): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/update-product-group`
  await ServerLogic.postWithAccessToken(url, { townId, businessId, productGroupId, productItems })
}

/**
 * 商品グループを削除
 * @param productGroupId 商品グループID
 */
export const deleteProductGroup = async (productGroupId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/delete-product-group`
  await ServerLogic.postWithAccessToken(url, { productGroupId })
}


/**
 * アップロード用URLを取得
 * @param fileName ファイル名
 * @param contentType コンテンツタイプ
 * @returns ResponseLink
 */
export const fetchImageSignedUrl = async (fileName: string, contentType: string): Promise<ResponseLink> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/image-signed-url`
  const response = await ServerLogic.postWithAccessToken(url, { fileName, contentType }) as ResponseLink
  return response
}


// ===============
// ProductCategory
// ===============

/**
 * 商品カテゴリをすべて取得
 * @returns ResponseProductCategories
 */
export const fetchProductCategories = async (): Promise<ResponseProductCategories> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/product-categories`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseProductCategories
  return response
}

/**
 * 商品カテゴリを取得
 * @param categoryId
 * @returns
 */
export const fetchProductCategory = async (categoryId: string): Promise<ResponseProductCategory> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/product-category`
  const response = await ServerLogic.postWithAccessToken(url, { categoryId }) as ResponseProductCategory
  return response
}

/**
 * 商品カテゴリを更新
 * @param productCategory 商品カテゴリ
 */
export const upsertProductCategory = async (productCategory: ProductCategory): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/upsert-product-category`
  await ServerLogic.postWithAccessToken(url, { productCategory })
}


/**
 * 商品カテゴリを削除
 * @param categoryId 商品カテゴリID
 */
export const deleteProductCategory = async (categoryId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/delete-product-category`
  await ServerLogic.postWithAccessToken(url, { categoryId })
}


// ===========
// OwnProduct
// ===========

/**
 * 自治体が出している商品の所有者を取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @returns ResponseOwnProducts
 */
export const fetchOwnProducts = async (townId: string, businessId: string): Promise<ResponseOwnProducts> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/own-products`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponseOwnProducts
  return response
}


/**
 * 商品の所有者を取得
 * @param productId 商品ID
 * @param tokenId トークンID
 * @param userId ユーザID
 * @returns ResponseOwnProduct
 */
export const fetchOwnProduct = async (productId: string, tokenId: number, userId: string): Promise<ResponseOwnProduct> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/own-product`
  const response = await ServerLogic.postWithAccessToken(url, { productId, tokenId, userId }) as ResponseOwnProduct
  return response
}


/**
 * 商品の所有者を取得（チャットIDから）
 * @param chatId チャットID
 * @param userId ユーザID
 * @returns ResponseOwnProduct
 */
export const fetchOwnProductByChatId = async (chatId: string, userId: string): Promise<ResponseOwnProduct> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/own-product-by-chat-id`
  const response = await ServerLogic.postWithAccessToken(url, { chatId, userId }) as ResponseOwnProduct
  return response
}



/**
 * 商品の属性を更新
 * @param productId 商品ID
 * @param tokenId トークンID
 * @param attributes 属性のリスト
 */
export const updateOwnProductAttributes = async (productId: string, tokenId: number, attributes: Attribute[]): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/update-own-product-attributes`
  await ServerLogic.postWithAccessToken(url, { productId, tokenId, attributes })
}


/**
 * 商品の管理者ステータスを更新
 * @param productId 商品ID
 * @param tokenId トークンID
 * @param adminStatus 管理者ステータス
 */
export const updateAdminProductStatus = async (productId: string, tokenId: number, adminStatus: AdminProductStatus): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/product/update-admin-product-status`
  await ServerLogic.postWithAccessToken(url, { productId, tokenId, adminStatus })
}