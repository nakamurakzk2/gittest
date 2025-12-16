import React from "react"
import LpPage from "@/app/(page)/lp/_components/LpPage"
import { generateLpMetadata } from "@/app/(page)/lp/_utils/generateLpMetadata"

export const metadata = generateLpMetadata({
  title: "せりの仕掛け体験、舞台での記念撮影権",
  description: "旧金毘羅大芝居の舞台機構「せり」を、閉館後の劇場を貸し切って体験できる。観客として眺めてきた「あの高鳴り」を、演じる側の視点で味わえます。舞台が持つ「生きた仕掛け」を、自分自身の身体で知る。ここでしか出会えない一夜を、どうぞ。",
  ogImagePath: "/lp/kotohira_lp/ogp.png",
  path: "lp/kotohira_lp",
})

export default function KotohiraLPPage() {
  return (
    <LpPage
      folderName="kotohira_lp"
      googleAnalyticsId="G-ZF6DFXHLQV"
      productGroupId="29258c31-021c-41b1-b3cb-bcdb2e88a487"
      productId="9daf0925-9f52-4368-8dfb-98fda1fdb2de"
    />
  )
}
