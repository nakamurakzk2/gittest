import * as CommonLogic from "@/logic/common-logic"

/**
 * POSTリクエスト
 * @param url URL
 * @param data データ
 */
const post = async (url: string, data: Record<string, unknown> | null = null) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : null,
    credentials: 'include',
    cache: 'no-store',
  })
  const json = await response.json()
  if (json.status !== "success") {
    throw new Error(json.message)
  }
  return json
}


/**
 * トークンをリクエスト
 * @param cardNumber カード番号
 * @param cardExpire カード有効期限
 * @param securityCode セキュリティコード
 * @param cardholderName カード名義人
 * @param tokenApiKey トークンAPIキー
 * @returns トークン
 */
export const requestMdkToken = async (cardNumber: string, cardExpire: string, securityCode: string, cardholderName: string, tokenApiKey: string): Promise<string> => {
  const endpoint = 'https://api3.veritrans.co.jp/4gtoken'
  const requestBody = {
    "card_number": cardNumber,
    "card_expire": cardExpire,
    "security_code": securityCode,
    "cardholder_name": cardholderName,
    "token_api_key": tokenApiKey,
    "lang": "ja"
  }
  const response = await post(endpoint, requestBody)
  return response.token
}
