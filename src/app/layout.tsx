import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { DESCRIPTION, OG_IMAGE_URL, SITE_URL, TITLE } from "@/define/metadata";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-noto-serif-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: [
    { rel: 'icon', url: '/icon.png' },
    { rel: 'apple-touch-icon', url: '/icon.png' },
  ],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: TITLE,
      }
    ],
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE_URL],
    site: SITE_URL,
  },
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="ja" className={notoSerifJP.variable}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, target-densitydpi=device-dpi" />
        <meta property="fb:app_id" content="28691439440500338" />
      </head>
      <body className="bg-blue-50 font-noto-serif-jp">
        <Providers>
          <GoogleAnalytics trackingId="G-L6JP7SS4FX" />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
