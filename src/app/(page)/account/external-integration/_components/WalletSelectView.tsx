"use client"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Web3AuthButton } from "@/components/Web3AuthButton"

export default function WalletSelectView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* 既存ウォレットユーザー向け */}
      <Card className="border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-md font-semibold text-gray-800">
            NFTウォレットを持っている方はこちら
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2 h-[50px]">
            過去に本サイトでウォレットを作成した方は右側のweb3authのボタンをクリックしてください
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Web3AuthButton title="WalletConnect" />
        </CardContent>
      </Card>

      {/* 新規ユーザー向け */}
      <Card className="border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-md font-semibold text-gray-800">
            はじめての方はこちら
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2 h-[50px]">
            簡単にウォレットを作成できます
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Web3AuthButton title="Web3Auth" />
        </CardContent>
      </Card>
    </div>
  )
}
