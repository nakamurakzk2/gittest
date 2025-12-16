import React from "react"
import LpPage from "@/app/(page)/lp/_components/LpPage"
import { generateLpMetadata } from "@/app/(page)/lp/_utils/generateLpMetadata"

export const metadata = generateLpMetadata({
  title: "むかわ町長に1時間プレゼンテーションできる権利",
  description: "むかわ町長へのプレゼンの権利を1口10万円で販売します。\nむかわ町長と直接対話できる、限定面談枠。アイデア、課題、問い、業種も規模も問いません。",
  ogImagePath: "/lp/mukawa_lp/ogp.png",
  path: "lp/mukawa_lp",
})

export default function MukawaLPPage() {
  return (
    <LpPage
      folderName="mukawa_lp"
      googleAnalyticsId="G-YJETMQQCKC"
      productGroupId="1240740e-b431-4d28-b3d3-078026bd4039"
      productId="290e055a-120a-442b-8020-c1564f445c5c"
    />
  )
}
