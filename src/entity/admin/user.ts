
export type AdminUser = {
  userId: string
  email: string
  name: string
  phoneNumber: string
  deleted: boolean
  adminUserType: AdminUserType
  townId: string | null
  businessId: string | null
  createdAt: number
}

export type SimpleAdminUser = {
  userId: string,
  email: string,
  name: string,
  adminUserType: AdminUserType
  townId: string | null
  businessId: string | null
}

export type AdminUserPassword = {
  userId: string
  password: string
  createdAt: number
  updatedAt: number
}

export type AdminUserPasswordRetry = {
  email: string
  retryCount: number
  retryCycle: number
  retryStart: number | null
  freezeTo: number | null
}

export type AdminUserPasswordReset = {
  key: string
  userId: string
  email: string
  expireTimestamp: number
}

export type AdminUserRefreshToken = {
  tokenHash: string
  userId: string
  expireTimestamp: number
}

export enum AdminUserType {
  NONE            = 'none',
  ENGINEER        = 'engineer',
  SUPER_ADMIN     = 'super-admin',
  TOWN            = 'town',
  TOWN_VIEWER     = 'town-viewer',
  BUSINESS        = 'business',
  BUSINESS_VIEWER = 'business-viewer',
}

export type CustomerSupportMemo = {
  userId: string
  productId: string
  tokenId: number
  townId: string
  businessId: string
  memo: string
  createdAt: number
  updatedAt: number
}
