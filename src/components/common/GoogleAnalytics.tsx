'use client'

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  trackingId: string
}

export default function GoogleAnalytics({ trackingId }: Props) {
  const pathname = usePathname()
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // パスが確定してから判定
    // /lp、/admin、/api配下のページでは読み込まない
    if (pathname && !pathname.startsWith('/lp') && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      setShouldLoad(true)
    } else {
      setShouldLoad(false)
    }
  }, [pathname])

  // /lp、/admin、/api配下のページでは読み込まない
  if (!shouldLoad) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-main" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `}
      </Script>
    </>
  )
}

