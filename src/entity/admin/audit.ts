/**
 * reCAPTCHA検証ログのEntity
 */

/**
 * reCAPTCHAアクションタイプ
 */
export enum RecaptchaActionType {
  ADMIN_LOGIN = 'admin_login',
  USER_LOGIN = 'user_login',
  USER_SIGNUP = 'user_signup',
}

/**
 * reCAPTCHA検証ログ
 */
export type RecaptchaVerificationLog = {
  logId: string
  actionType: RecaptchaActionType
  email: string
  clientIp: string | null
  recaptchaSuccess: boolean
  recaptchaScore: number | null
  recaptchaErrorCodes: string[] | null
  loginSuccess: boolean
  attemptedAt: number
  createdAt: number
}

