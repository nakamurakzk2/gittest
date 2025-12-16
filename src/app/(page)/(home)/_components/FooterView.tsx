"use client"

import Link from "next/link"
import Image from "next/image"
import { LANGUAGE_LIST } from "@/define/language"
import { useLanguageSession } from "@/providers/language-provider"

export default function FooterView() {
  const { getLocalizedText } = useLanguageSession()

  const navigationItems = [
    { text: LANGUAGE_LIST.OperatingCompany, href: "https://alyawmu.com/company/#company_overview", external: true },
    { text: LANGUAGE_LIST.TermsOfUse, href: "/terms", external: false },
    { text: LANGUAGE_LIST.PrivacyPolicy, href: "/privacy", external: false },
    { text: LANGUAGE_LIST.ContactUs, href: "https://help.alyawmu.com/hc/ja/requests/new", external: true }
  ]

  return (
    <footer className="bg-[#2B2B2B] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* ナビゲーションリンク */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          {navigationItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  {getLocalizedText(item.text)}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  {getLocalizedText(item.text)}
                </Link>
              )}
              {index < navigationItems.length - 1 && (
                <div className="w-px h-4 bg-gray-600 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* ロゴ */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <Image
              src="/assets/logo-white.png"
              alt="TOKKEN Logo"
              width={300}
              height={50}
              className="object-contain"
            />
          </div>
        </div>

        {/* コピーライト */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2025 TOKKEN All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
