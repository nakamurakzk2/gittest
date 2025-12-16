import { readFileSync } from "fs"
import { join } from "path"

/**
 * LPのHTMLファイルから<main>タグの内容を抽出し、画像パスを変換する
 * @param lpName LPのディレクトリ名（例: 'mukawa_lp-main'）
 * @returns 変換されたHTMLコンテンツ
 */
export function loadLpContent(lpName: string): string {
  const htmlPath = join(process.cwd(), `public/lp/${lpName}/index.html`)
  const html = readFileSync(htmlPath, 'utf-8')

  // <main>タグの内容を抽出
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  if (!mainMatch) return ''

  let content = mainMatch[1]

  // 画像パスを一括変換
  // src="./images/" → src="/lp/[lpName]/images/"
  content = content.replace(/src=["']\.\/images\//g, `src="/lp/${lpName}/images/`)
  // url(./images/) → url(/lp/[lpName]/images/)
  content = content.replace(/url\(["']?\.\/images\//g, `url(/lp/${lpName}/images/`)
  // background: url("./images/") → background: url("/lp/[lpName]/images/")
  content = content.replace(/background:\s*url\(["']?\.\/images\//g, `background: url(/lp/${lpName}/images/`)

  return content
}

