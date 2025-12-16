import { ChainId } from '@/define/contract'
import crypto from 'crypto'
import imageCompression from 'browser-image-compression'
import { SignJWT } from 'jose'
import { AdminUserType } from '@/entity/admin/user'

/**
 * ランダムな文字列を生成
 * @param length 文字列の長さ
 */
export const getRandomText = (length: number) => {
  const text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from(crypto.randomFillSync(new Uint8Array(length))).map((n)=>text[n%text.length]).join('')
}

/**
 * メールアドレスが有効かどうかをチェック
 * @param email メールアドレス
 * @returns 有効だったらtrue
 */
export const isValidEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

/**
 * 指定時間待機
 * @param ms 待機時間(ミリ秒)
 */
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * タームを取得
 * @param time 日時ミリ秒
 * @returns ターム
 */
export const getTerm = (time: number): number => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year * 10000 + month * 100 + day
}

/**
 * 指定フォーマットに従って日時テキストを取得
 * @param time 日時ミリ秒
 * @param format フォーマット
 * @returns 日時テキスト
 */
export const formatDate = (time: number, format: string): string => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)
  const minute = ('0' + date.getMinutes()).slice(-2)
  const second = ('0' + date.getSeconds()).slice(-2)
  return format.replace(/yyyy/g, year.toString())
    .replace(/MM/g, month.toString())
    .replace(/dd/g, day.toString())
    .replace(/hh/g, hour.toString())
    .replace(/mm/g, minute.toString())
    .replace(/ss/g, second.toString())
}

/**
 * アドレスが有効かどうかをチェック
 * @param address アドレス
 * @returns 有効かどうか
 */
export const isValidAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * アドレスを短縮
 * @param address アドレス
 * @returns 短縮されたアドレス
 */
export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * 全角文字列かどうかをチェック
 * @param text 文字列
 * @returns 全角文字列かどうか
 */
export const isZenkaku = (text: string) => {
  return /^[^\u0020-\u007E\uFF61-\uFF9F]*$/.test(text);
}

/**
 * 全角カナで構成された文字列かどうかをチェック
 * @param text 文字列
 * @returns 全角カナで構成された文字列かどうか
 */
export const isValidKana = (text: string) => {
  return /^[\u30A0-\u30FF]+$/.test(text)
}

/**
 * エクスプローラーのトランザクションURLを取得
 * @param chainId チェーンID
 * @param hash ハッシュ
 * @returns エクスプローラーのトランザクションURL
 */
export const getExplorerTransactionUrl = (chainId: number, hash: string) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return `https://etherscan.io/tx/${hash}`
    case ChainId.POLYGON:
      return `https://polygonscan.com/tx/${hash}`
    case ChainId.BASE:
      return `https://basescan.org/tx/${hash}`
    case ChainId.SEPOLIA:
      return `https://sepolia.etherscan.io/tx/${hash}`
    default:
      return ''
  }
}

/**
 * エクスプローラーのアドレスURLを取得
 * @param chainId チェーンID
 * @param address アドレス
 * @returns エクスプローラーのアドレスURL
 */
export const getExplorerAddressUrl = (chainId: number, address: string) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return `https://etherscan.io/address/${address}`
    case ChainId.POLYGON:
      return `https://polygonscan.com/address/${address}`
    case ChainId.BASE:
      return `https://basescan.org/address/${address}`
    case ChainId.SEPOLIA:
      return `https://sepolia.etherscan.io/address/${address}`
    default:
      return ''
  }
}

export const getChainIcon = (chainId: number) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return "/chain/ethereum.png"
    case ChainId.POLYGON:
      return "/chain/polygon.png"
    default:
      return null
  }
}

export const getCurrencySymbol = (chainId: number) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return "ETH"
    case ChainId.POLYGON:
      return "POL"
    default:
      return ''
  }
}


/**
 * マーケットプレイスのURLを取得
 * @param chainId チェーンID
 * @param contractAddress コントラクトアドレス
 * @param tokenId トークンID
 * @returns マーケットプレイスのURL
 */
export const getMarketplaceUrl = (chainId: number, contractAddress: string, tokenId: string) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`
    case ChainId.POLYGON:
      return `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`
    default:
      return ''
  }
}



/**
 * 画像を圧縮
 * @param file             画像ファイル
 * @param maxWidthOrHeight 最大幅または高さ
 * @param maxSizeMB        最大サイズ(MB)
 * @returns File
 */
export const compressImage = async (file: File, maxWidthOrHeight: number = 500, maxSizeMB: number = 1): Promise<File> => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true
  }
  const compressedFile = await imageCompression(file, options)

  const beforeSizeMB = file.size / (1024 * 1024)
  const afterSizeMB = compressedFile.size / (1024 * 1024)
  console.log(`${beforeSizeMB.toFixed(2)}MB → ${afterSizeMB.toFixed(2)}MB (${((1 - afterSizeMB / beforeSizeMB) * 100).toFixed(1)}% 削減)`)

  return compressedFile
}

/**
 * セキュアトークンを生成
 */
export const generateSecureToken = async (): Promise<string> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(secret)

  return token
}

/**
 * QRコードをダウンロード
 * @param svgData SVGデータ
 * @param filename ファイル名
 */
export const downloadQrCode = (svgData: string, filename: string) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const img = document.createElement('img')

  img.onload = () => {
    canvas.width = 500
    canvas.height = 500
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${filename}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  img.src = 'data:image/svg+xml;base64,' + btoa(svgData)


}


/**
 * 管理者タイプラベルを取得
 * @param type 管理者タイプ
 * @returns ラベル
 */
export const getAdminTypeLabel = (type: AdminUserType) => {
  switch (type) {
    case AdminUserType.ENGINEER:
      return "開発者"
    case AdminUserType.SUPER_ADMIN:
      return "管理者"
    case AdminUserType.TOWN:
      return "自治体"
    case AdminUserType.TOWN_VIEWER:
      return "自治体(閲覧のみ)"
    case AdminUserType.BUSINESS:
      return "事業者"
    case AdminUserType.BUSINESS_VIEWER:
      return "事業者(閲覧のみ)"
    default:
      return "＊＊未定義＊＊"
  }
}


/**
 * マークダウンテキストをプレーンテキストに変換
 * @param markdown マークダウンテキスト
 * @returns プレーンテキスト
 */
export const markdownToPlainText = (markdown: string): string => {
  return markdown
    // ヘッダー記号を削除
    .replace(/^#{1,6}\s+/gm, '')
    // リンクテキストを抽出（[text](url) -> text）
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 画像記号を削除（![alt](url) -> alt）
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // 太字記号を削除（**text** -> text）
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // 斜体記号を削除（*text* -> text）
    .replace(/\*([^*]+)\*/g, '$1')
    // インラインコード記号を削除（`code` -> code）
    .replace(/`([^`]+)`/g, '$1')
    // コードブロック記号を削除
    .replace(/```[\s\S]*?```/g, '')
    // リスト記号を削除
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 水平線を削除
    .replace(/^[-*_]{3,}$/gm, '')
    // 引用記号を削除
    .replace(/^>\s*/gm, '')
    // 複数の改行を単一の改行に変換
    .replace(/\n\s*\n/g, '\n')
    // 先頭と末尾の空白を削除
    .trim()
}

