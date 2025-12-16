// Entity
import { ResponsePendingPayments } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


// ==============
// PendingPayment
// ==============

/**
 * 商品の決済情報を取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 */
export const fetchPendingPayments = async (townId: string, businessId: string): Promise<ResponsePendingPayments> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/payment/pending-payments`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponsePendingPayments
  return response
}
