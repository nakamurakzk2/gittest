// Entity
import { ResponseAdminUsers } from "@/entity/response"
import { AdminUserType } from "@/entity/admin/user"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * 管理者ユーザリストを取得
 * @returns ResponseAdminUsers
 */
export const fetchSuperAdminUsers = async (): Promise<ResponseAdminUsers> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/user/super-admin-users`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseAdminUsers
  return response
}

/**
 * 自治体ユーザリストを取得
 * @returns ResponseAdminUsers
 */
export const fetchTownUsers = async (): Promise<ResponseAdminUsers> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/user/town-users`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseAdminUsers
  return response
}

/**
 * 事業者ユーザリストを取得
 * @param townId 自治体ID
 * @returns ResponseAdminUsers
 */
export const fetchBusinessUsers = async (townId: string): Promise<ResponseAdminUsers> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/user/business-users`
  const response = await ServerLogic.postWithAccessToken(url, { townId }) as ResponseAdminUsers
  return response
}

/**
 * 管理者アカウントを更新
 * @param targetUserId 対象ユーザID
 * @param adminUserType 管理者ユーザタイプ
 * @returns ResponseAdminUsers
 */
export const upsertAdminUser = async (targetUserId: string, adminUserType: AdminUserType): Promise<ResponseAdminUsers> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/user/upsert-admin-user`
  const response = await ServerLogic.postWithAccessToken(url, { targetUserId, adminUserType }) as ResponseAdminUsers
  return response
}


/**
 * 管理者アカウントを削除
 * @param targetUserId 対象ユーザID
 * @returns ResponseAdminUsers
 */
export const deleteAdminUser = async (targetUserId: string): Promise<ResponseAdminUsers> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/user/delete-admin-user`
  const response = await ServerLogic.postWithAccessToken(url, { targetUserId }) as ResponseAdminUsers
  return response
}

