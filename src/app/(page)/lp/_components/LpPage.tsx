import React from "react"
import Script from "next/script"
import { loadLpContent } from "@/app/(page)/lp/_utils/loadLpContent"
import { loadLpCssContent } from "@/app/(page)/lp/_utils/loadLpStyles"
import LpContentView from "@/app/(page)/lp/_components/LpContentView"
import LpFloatingButton from "@/app/(page)/lp/_components/LpFloatingButton"
import LpProductView from "@/app/(page)/lp/_components/LpProductView"

type Props = {
  folderName: string
  productGroupId?: string | undefined
  productId?: string | undefined
  googleAnalyticsId?: string | undefined
}

export default function LpPage({folderName, productGroupId = undefined, productId = undefined, googleAnalyticsId = undefined}: Props) {
  const htmlContent = loadLpContent(folderName)
  const cssContent = loadLpCssContent(folderName)

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />
      <div className="w-full bg-white min-h-screen">
        <LpContentView htmlContent={htmlContent} />
        {productGroupId && productId && (<>
          <LpFloatingButton />
          <LpProductView
            productGroupId={productGroupId}
            productId={productId}
          />
        </>)}
      </div>
    </>
  )
}

