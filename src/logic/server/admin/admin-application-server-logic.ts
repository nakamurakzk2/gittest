// Logic
import { AdminUserType } from "@/entity/admin/user"
import { ResponseBusinessApplications, ResponseSuperAdminApplications, ResponseTownApplications } from "@/entity/response"
import * as ServerLogic from "@/logic/server-logic"


// ========
// 申請処理
// ========

/**
 * 管理者ユーザに申請
 * @param email    メールアドレス
 * @param name     名前
 * @param password パスワード
 */
export const applySuperAdmin = async (email: string, name: string, password: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/apply-super-admin`
  await ServerLogic.postWithNoAuth(url, { email, name, password })
}

/**
 * 管理者ユーザに申請
 * @param email        メールアドレス
 * @param name         名前
 * @param phoneNumber  電話番号
 * @param townId 自治体ID
 * @param password     パスワード
 */
export const applyTown = async (email: string, name: string, phoneNumber: string, townId: string, password: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/apply-town`
  await ServerLogic.postWithNoAuth(url, { email, name, phoneNumber, townId, password })
}

/**
 * 事業者ユーザに申請
 * @param email        メールアドレス
 * @param name         名前
 * @param phoneNumber  電話番号
 * @param townId 自治体ID
 * @param businessName 事業者名
 * @param password     パスワード
 */
export const applyBusiness = async (email: string, name: string, phoneNumber: string, townId: string, businessName: string, password: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/apply-business`
  await ServerLogic.postWithNoAuth(url, { email, name, phoneNumber, townId, businessName, password })
}


// ===========
// 管理者ユーザ
// ===========

/**
 * 管理者ユーザの申請リストを取得
 * @returns
 */
export const fetchSuperAdminApplications = async (): Promise<ResponseSuperAdminApplications> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/super-admin-applications`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseSuperAdminApplications
  return response
}

/**
 * 管理者ユーザの申請を承認
 * @param userId ユーザーID
 */
export const approveSuperAdminApplication = async (userId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/accept-super-admin`
  await ServerLogic.postWithAccessToken(url, { userId })
}

/**
 * 管理者ユーザの申請を拒否
 * @param userId ユーザーID
 */
export const rejectSuperAdminApplication = async (userId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/reject-super-admin`
  await ServerLogic.postWithAccessToken(url, { userId })
}


// ============
// 自治体ユーザ
// ============

/**
 * 自治体ユーザの申請リストを取得
 * @returns ResponseTownApplications
 */
export const fetchTownApplications = async (): Promise<ResponseTownApplications> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/town-applications`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseTownApplications
  return response
}

/**
 * 自治体ユーザの申請を承認
 * @param userId ユーザーID
 * @param adminUserType 管理者タイプ
 */
export const approveTownApplication = async (userId: string, adminUserType: AdminUserType): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/accept-town`
  await ServerLogic.postWithAccessToken(url, { userId, adminUserType })
}

/**
 * 自治体ユーザの申請を拒否
 * @param userId ユーザーID
 * @param adminUserType 管理者タイプ
 */
export const rejectTownApplication = async (userId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/reject-town`
  await ServerLogic.postWithAccessToken(url, { userId })
}


// ============
// 事業者ユーザ
// ============

/**
 * 事業者ユーザの申請リストを取得
 * @param townId 自治体ID
 * @returns ResponseBusinessApplications
 */
export const fetchBusinessApplications = async (townId: string): Promise<ResponseBusinessApplications> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/business-applications`
  const response = await ServerLogic.postWithAccessToken(url, { townId }) as ResponseBusinessApplications
  return response
}

/**
 * 事業者ユーザの申請を承認
 * @param userId ユーザーID
 * @param adminUserType 管理者タイプ
 * @param townId 自治体ID
 * @param businessId 事業者ID
 */
export const approveBusinessApplication = async (userId: string, adminUserType: AdminUserType, townId: string, businessId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/accept-business`
  await ServerLogic.postWithAccessToken(url, { userId, adminUserType, townId, businessId })
}

/**
 * 事業者ユーザの申請を拒否
 * @param userId ユーザーID
 * @param townId 自治体ID
 */
export const rejectBusinessApplication = async (userId: string, townId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/application/reject-business`
  await ServerLogic.postWithAccessToken(url, { userId, townId })
}
