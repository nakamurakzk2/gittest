import * as CommonLogic from "@/logic/common-logic"
import * as ServerLogic from "@/logic/server-logic"
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"
import * as UserProductPageServerLogic from "@/logic/server/user/user-product-page-server-logic"
import * as AdminTownServerLogic from "@/logic/server/admin/admin-town-server-logic"

/**
 * ユーザーアイコンをアップロード
 * @param file ファイル
 * @return アップロード先URL
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  const fileName = file.name
  const contentType = file.type
  const { link } = await AdminProductServerLogic.fetchImageSignedUrl(fileName, contentType)
  await ServerLogic.uploadFile(link, file, contentType)
  return link.split('?')[0]
}


/**
 * フォーム画像をアップロード
 * @param file ファイル
 * @returns アップロード先URL
 */
export const uploadFormImage = async (file: File): Promise<string> => {
  const compressedImage = await CommonLogic.compressImage(file, 512)
  const fileName = file.name
  const contentType = file.type
  const { link } = await UserProductPageServerLogic.fetchImageSignedUrl(fileName, contentType)
  await ServerLogic.uploadFile(link, compressedImage, contentType)
  return link.split('?')[0]
}


/**
 * 自治体画像をアップロード
 * @param file ファイル
 * @returns アップロード先URL
 */
export const uploadTownImage = async (file: File): Promise<string> => {
  const fileName = file.name
  const contentType = file.type
  const { link } = await AdminTownServerLogic.fetchImageSignedUrl(fileName, contentType)
  await ServerLogic.uploadFile(link, file, contentType)
  return link.split('?')[0]
}