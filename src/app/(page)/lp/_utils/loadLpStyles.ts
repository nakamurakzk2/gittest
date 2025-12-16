import { readFileSync } from "fs"
import { join } from "path"

/**
 * LPのHTMLファイルからCSSファイル名を抽出する
 * @param lpName LPのディレクトリ名（例: 'mukawa_lp-main'）
 * @returns CSSファイル名（例: 'styles_mukawa.css'）
 */
export function getLpCssFileName(lpName: string): string | null {
  const htmlPath = join(process.cwd(), `public/lp/${lpName}/index.html`)
  const html = readFileSync(htmlPath, 'utf-8')

  // <head>タグ内の<link rel="stylesheet">を抽出
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  if (!headMatch) return null

  const headContent = headMatch[1]

  // <link rel="stylesheet" href="..."> を抽出
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/i
  const match = headContent.match(linkRegex)

  if (!match) return null

  let href = match[1]

  // ファイル名を抽出（パスから）
  if (href.includes('/')) {
    const parts = href.split('/')
    href = parts[parts.length - 1]
  }

  // ./ を削除
  if (href.startsWith('./')) {
    href = href.substring(2)
  }

  return href
}

/**
 * LPのCSSファイルの内容を読み込む
 * @param lpName LPのディレクトリ名（例: 'mukawa_lp-main'）
 * @param cssFileName CSSファイル名（例: 'styles_mukawa.css'）。省略時はHTMLから自動取得
 * @returns CSSファイルの内容（画像パスを変換済み）
 */
export function loadLpCssContent(lpName: string, cssFileName?: string): string {
  // CSSファイル名が指定されていない場合はHTMLから取得
  const fileName = cssFileName || getLpCssFileName(lpName)
  if (!fileName) {
    console.warn(`CSS file not found for LP: ${lpName}`)
    return ''
  }

  const cssPath = join(process.cwd(), `public/lp/${lpName}/${fileName}`)

  try {
    let cssContent = readFileSync(cssPath, 'utf-8')

    // 画像パスを変換
    // url("./images/") → url("/lp/[lpName]/images/")
    cssContent = cssContent.replace(/url\(["']?\.\/images\//g, `url(/lp/${lpName}/images/`)
    // url("./images/") → url("/lp/[lpName]/images/") (シングルクォートの場合)
    cssContent = cssContent.replace(/url\(['"]?\.\/images\//g, `url(/lp/${lpName}/images/`)

    return cssContent
  } catch (error) {
    console.error(`Failed to load CSS file: ${cssPath}`, error)
    return ''
  }
}
