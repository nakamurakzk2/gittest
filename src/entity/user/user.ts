export type User = {
  userId: string
  email: string
  birthDate: string
  billingInfo: BillingInfo
  accountStatus: UserAccountStatus
  loginAccounts: LoginAccount[]
  transferAddress: string | null
  createdAt: number
  updatedAt: number
}

export type Prefecture = {
  prefcode: number
  name: string
}

export type BillingInfo = {
  lastName: string
  firstName: string
  lastNameKana: string
  firstNameKana: string
  phoneNumber: string
  zipCode: string
  prefCode: number | undefined
  city: string
  address: string
  building: string
}

export enum UserAccountStatus {
  NOT_AUTHORIZED = "NotAuthorized",
  AUTHORIZED = "Authorized",
  DELETED = "Deleted"
}

export type UserFormData = {
  email: string
  password: string
}

export type SimpleUser = {
  userId: string,
  email: string,
  transferAddress: string | null
}

export type UserAuthorize = {
  key: string
  userId: string
  authorized: boolean | undefined
  beforeEmail: string
  createdAt: number
}

export type UserPassword = {
  userId: string
  password: string
  createdAt: number
  updatedAt: number
}

export type UserPasswordUpdate = {
  key: string
  userId: string
  password: string
  expireTimestamp: number
}

export type UserPasswordRetry = {
  email: string
  retryCount: number
  retryCycle: number
  retryStart: number | null
  freezeTo: number | null
}

export type UserPasswordReset = {
  key: string
  userId: string
  email: string
  expireTimestamp: number
}

export type LoginAccount = {
  userId: string
  accountId: string
  loginType: LoginType
  name: string
}

export enum LoginType {
  Google = 'google',
}

export type LoginKey = {
  key: string
  userId: string
  expiresAt: number
}

export type LoginToken = {
  accessToken: string
  refreshToken: string
}

export type UserRefreshToken = {
  tokenHash: string
  userId: string
  expireTimestamp: number
}

export type UserWallet = {
  walletAddress: string
  userId: string
  name: string
  isWeb3Auth: boolean
  balanceEth: number
  createdAt: number
  updatedAt: number
}

export type WalletNonce = {
  walletAddress: string
  nonce: string
  createdAt: number
}

export type SimpleUserWallet = {
  walletAddress: string
  name: string
}

export type UserA8 = {
  userId: string
  a8: string
  usedCount: number
  createdAt: number
  expiresAt: number
}