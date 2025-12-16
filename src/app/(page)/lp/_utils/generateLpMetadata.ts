import type { Metadata } from "next"
import { SITE_URL } from "@/define/metadata"

type LpMetadataParams = {
  title: string
  description: string
  ogImagePath: string
  path?: string
}

/**
 * LPページ用のメタデータを生成する
 * @param params メタデータのパラメータ
 * @returns Next.jsのMetadataオブジェクト
 */
export function generateLpMetadata({
  title,
  description,
  ogImagePath,
  path = "",
}: LpMetadataParams): Metadata {
  const url = path ? `${SITE_URL}${path}` : SITE_URL

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImagePath],
    },
  }
}

