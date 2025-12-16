// Entity
import { ResponseSimpleProduct, ResponseSimpleProductItem } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"



/**
 * 商品情報を取得
 * @param productGroupId 商品グループID
 * @returns ResponseSimpleProduct
 */
export const fetchSimpleProduct = async (productGroupId: string): Promise<ResponseSimpleProduct> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/public/simple-product`
  const response = await ServerLogic.postWithNoAuth(url, { productGroupId }) as ResponseSimpleProduct
  return response
}

/**
 * 商品アイテムを取得
 * @param productId 商品アイテムID
 * @returns ResponseSimpleProductItem
 */
export const fetchSimpleProductProductItem = async (productId: string): Promise<ResponseSimpleProductItem> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/public/simple-product-item`
  const response = await ServerLogic.postWithNoAuth(url, { productId }) as ResponseSimpleProductItem
  return response
}


