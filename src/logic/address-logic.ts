import { Prefecture } from "@/entity/user/user"

// 地域・都道府県のデータ構造
export const regions = [
  {
    name: "北海道",
    prefectures: ["北海道"]
  },
  {
    name: "東北",
    prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"]
  },
  {
    name: "関東",
    prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"]
  },
  {
    name: "中部",
    prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"]
  },
  {
    name: "近畿",
    prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"]
  },
  {
    name: "中国",
    prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"]
  },
  {
    name: "四国",
    prefectures: ["徳島県", "香川県", "愛媛県", "高知県"]
  },
  {
    name: "九州・沖縄",
    prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
  }
]

/**
 * 都道府県一覧を取得
 * @returns Prefecture[]
 */
export const getPrefectures = (): Prefecture[] => {
  return [
    { prefcode: 1, name: '北海道' },
    { prefcode: 2, name: '青森県' },
    { prefcode: 3, name: '岩手県' },
    { prefcode: 4, name: '宮城県' },
    { prefcode: 5, name: '秋田県' },
    { prefcode: 6, name: '山形県' },
    { prefcode: 7, name: '福島県' },
    { prefcode: 8, name: '茨城県' },
    { prefcode: 9, name: '栃木県' },
    { prefcode: 10, name: '群馬県' },
    { prefcode: 11, name: '埼玉県' },
    { prefcode: 12, name: '千葉県' },
    { prefcode: 13, name: '東京都' },
    { prefcode: 14, name: '神奈川県' },
    { prefcode: 15, name: '新潟県' },
    { prefcode: 16, name: '富山県' },
    { prefcode: 17, name: '石川県' },
    { prefcode: 18, name: '福井県' },
    { prefcode: 19, name: '山梨県' },
    { prefcode: 20, name: '長野県' },
    { prefcode: 21, name: '岐阜県' },
    { prefcode: 22, name: '静岡県' },
    { prefcode: 23, name: '愛知県' },
    { prefcode: 24, name: '三重県' },
    { prefcode: 25, name: '滋賀県' },
    { prefcode: 26, name: '京都府' },
    { prefcode: 27, name: '大阪府' },
    { prefcode: 28, name: '兵庫県' },
    { prefcode: 29, name: '奈良県' },
    { prefcode: 30, name: '和歌山県' },
    { prefcode: 31, name: '鳥取県' },
    { prefcode: 32, name: '島根県' },
    { prefcode: 33, name: '岡山県' },
    { prefcode: 34, name: '広島県' },
    { prefcode: 35, name: '山口県' },
    { prefcode: 36, name: '徳島県' },
    { prefcode: 37, name: '香川県' },
    { prefcode: 38, name: '愛媛県' },
    { prefcode: 39, name: '高知県' },
    { prefcode: 40, name: '福岡県' },
    { prefcode: 41, name: '佐賀県' },
    { prefcode: 42, name: '長崎県' },
    { prefcode: 43, name: '熊本県' },
  ]
}

/**
 * 都道府県名からprefCodeを取得
 * @param prefectureName 都道府県名
 * @returns prefCode | null
 */
export const getPrefCodeFromName = (prefectureName: string): number | null => {
  const prefectures = getPrefectures()
  const prefecture = prefectures.find(p => p.name === prefectureName)
  return prefecture ? prefecture.prefcode : null
}

/**
 * 郵便番号から住所を取得
 * @param zipCode 郵便番号
 * @returns 住所情報 | null
 */
export const fetchAddressFromZipCode = async (zipCode: string): Promise<{ prefCode: number, city: string } | null> => {
  try {
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`)
    const data = await response.json()
    return {
      prefCode: Number(data.results[0].prefcode),
      city: data.results[0].address2 + data.results[0].address3,
    }
  } catch (error) {
    console.error(error)
  }
  return null
}