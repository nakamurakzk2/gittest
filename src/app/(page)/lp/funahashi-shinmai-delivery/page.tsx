import React from "react"
import LpPage from "@/app/(page)/lp/_components/LpPage"
import { generateLpMetadata } from "@/app/(page)/lp/_utils/generateLpMetadata"

export const metadata = generateLpMetadata({
  title: "舟橋村の新米定期配送権",
  description: "収穫のたびに、今年いちばんの白米が届く。日本一小さな村から届く贅沢を、習慣に。\n値動きに揺れる時代でも、一回払えば毎年“新米”が確実に届くという贅沢が得られる。 この商品は刈りたての白米を、収穫期に合わせてお届けします。お選びいただくのは、生産者と受け取る年数。新鮮な お米を10年間受け取り、”新しい形の物価高対策”をすることができます。",
  ogImagePath: "/lp/funahashi_lp/ogp.png",
  path: "lp/funahashi_lp",
})

export default function FunahashiLPPage() {
  return (
    <LpPage
      folderName="funahashi_lp"
      googleAnalyticsId="G-7E5YH9X4H1"
    />
  )
}
