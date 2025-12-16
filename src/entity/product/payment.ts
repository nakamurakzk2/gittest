import { BillingInfo } from '@/entity/user/user'

export enum PaymentType {
  CREDIT = 'credit',
  BANK = 'bank',
}

/**
 * 決済履歴
 */
export type ProductPaymentHistory = {
  orderId: string
  isDummy: boolean
  userId: string
  productId: string
  townId: string
  amount: number
  term: number
  paymentType: PaymentType
  mstatus: string
  vResultCode: string
  requestId: string | null
  resultJson: string
  email: string
  billingInfo: BillingInfo
  createdAt: number
}

/**
 * 未決済の支払い情報
 */
export type ProductPendingPayment = {
  orderId: string
  userId: string
  productGroupId: string
  productId: string
  amount: number
  price: number
  tokenIds: number[]
  email: string
  billingInfo: BillingInfo
  status: ProductPendingPaymentStatus
  a8: string | null
  term: number
  createdAt: number
  updatedAt: number
}

export enum ProductPendingPaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}


export type ProductPaymentWebhook = {
  orderId: string
  paymentType: PaymentType
  createdAt: number
}

/**
 * Webhookの銀行決済情報
 */
export type ProductPaymentWebhookBank = {
  webhookId: string
  pushId: string
  pushTime: string
  items: WebhookBankItem[]
}

/**
 * Webhookのクレカ決済情報
 */
export type ProductPaymentWebhookCredit = {
  webhookId: string
  pushId: string
  pushTime: string
  items: WebhookCreditItem[]
}

/**
 * 決済加盟店情報
 */
export type PaymentMerchant = {
  townId: string
  merchantCcId: string
  merchantSecretKey: string
  tokenApiKey: string
  dummyRequest: string
}


/**
 * Webhookで受け取ったクレカ決済アイテム
 */
export type WebhookCreditItem = {
  orderId: string
  vResultCode: string
  txnType: string
  mpiMstatus: string
  cardMstatus: string
  dummy: string
}

/**
 * Webhookで受け取った銀行決済アイテム
 */
export type WebhookBankItem = {
  orderId: string
  kikanNo: string
  kigyoNo: string
  rcvDate: string
  customerNo: number
  confNo: string
  rcvAmount: number
  dummy: string
  bankCode: string
  payEasyFlag: string
}

