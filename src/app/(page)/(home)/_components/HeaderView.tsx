"use client"

import { useState, useEffect } from "react"
import { User, HelpCircle, Search, Menu, X, UserIcon } from "lucide-react"
import Link from "next/link"
import { LANGUAGE_LIST } from "@/define/language"

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Providers
import { useUserSession } from "@/providers/user-session-provider"
import { useLanguageSession } from "@/providers/language-provider"
import { useRouter } from "next/navigation"
import { MultiLanguageText } from "@/entity/language"
import MobileLanguageView from "./MobileLanguageView"
import Image from "next/image"

const navigationItems: { text: MultiLanguageText; href: string }[] = [
  { text: LANGUAGE_LIST.Top, href: "/" },
  { text: LANGUAGE_LIST.Ranking, href: "/ranking" },
  { text: LANGUAGE_LIST.TownList, href: "/towns" },
  { text: LANGUAGE_LIST.Feature, href: "/feature" },
]


export default function HeaderView() {
  const { simpleUser } = useUserSession()
  const { getLocalizedText } = useLanguageSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isComposing, setIsComposing] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const openSearchOverlay = () => {
    setIsSearchOverlayOpen(true)
  }

  const closeSearchOverlay = () => {
    setIsSearchOverlayOpen(false)
    setSearchQuery("")
  }

  const executeSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
      closeSearchOverlay()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      executeSearch()
    } else if (e.key === "Escape") {
      closeSearchOverlay()
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  // ESCキーでオーバーレイを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOverlayOpen) {
        closeSearchOverlay()
      }
    }

    if (isSearchOverlayOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isSearchOverlayOpen])

  // ページ遷移時にモバイルメニューを閉じる
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }

    // Next.jsのルート変更を監視
    const originalPush = router.push
    router.push = (...args) => {
      handleRouteChange()
      return originalPush.apply(router, args)
    }

    return () => {
      router.push = originalPush
    }
  }, [router])

  return (
    <div
      className="w-screen mx-auto flex items-center justify-center bg-repeat bg-center"
      style={{ backgroundImage: "url('/assets/header-image-pc.png')" }}
    >
      <div className="w-full max-w-6xl mx-auto flex-shrink-0 bg-white">
        {/* メインヘッダー */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          {/* 左側: 検索ボタン（PCのみ） */}
          <div className="hidden md:flex items-center space-x-2 flex-1">
            <Button variant="ghost" size="sm" className="text-gray-600" onClick={openSearchOverlay}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* 中央: ロゴ */}
          <Link href="/" className="text-xl md:text-2xl font-bold text-gray-800 flex-shrink-0">
            <Image src="/assets/logo-with-text.svg" alt="TOKKEN Logo" width={190} height={120} className="hidden md:block object-contain" />
            <Image src="/assets/logo-with-text.svg" alt="TOKKEN Logo" width={150} height={100} className="block md:hidden object-contain" />
          </Link>

          {/* 右側: ユーザー関連ボタン（PCのみ） */}
          <div className="hidden md:flex items-center space-x-3 flex-1 justify-end">
            <a
              href="https://help.alyawmu.com/hc/ja/requests/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              {getLocalizedText(LANGUAGE_LIST.Help)}
            </a>
            {simpleUser == null && (
              <div className="flex items-center">
                <User className="h-4 w-4" />
                <Button variant="ghost" size="sm" className="text-gray-600 text-xs" onClick={() => router.push("/login")}>
                  {getLocalizedText(LANGUAGE_LIST.Login)}
                </Button>
                <span className="text-gray-600 text-xs">/</span>
                <Button variant="ghost" size="sm" className="text-gray-600 text-xs" onClick={() => router.push("/signup")}>
                  {getLocalizedText(LANGUAGE_LIST.Signup)}
                </Button>
              </div>
            )}
            {simpleUser != null && (
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => router.push("/account")}>
                <User className="h-4 w-4 mr-1" />
                {getLocalizedText(LANGUAGE_LIST.Account)}
              </Button>
            )}
          </div>

          {/* モバイル: ハンバーガーメニューボタン */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" className="text-gray-600" onClick={openSearchOverlay}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => simpleUser == null ? router.push("/login") : router.push("/account")}>
              <UserIcon className="h-5 w-5" />
            </Button>
            <a
              href="https://help.alyawmu.com/hc/ja/requests/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
            >
              <HelpCircle className="h-5 w-5" />
            </a>
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* PCナビゲーション */}
        <div className="hidden md:block px-6 py-3">
          <nav className="flex items-center justify-center space-x-8">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm"
              >
                {getLocalizedText(item.text)}
              </Link>
            ))}
          </nav>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="absolute left-0 right-0 bg-white border-t border-gray-200 rounded-b-lg pb-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 md:px-6 py-4">
                <Link href="/" className="text-xl md:text-2xl font-bold text-gray-800 flex-shrink-0">
                  <Image src="/assets/logo.png" alt="TOKKEN Logo" width={100} height={100} />
                </Link>
                <div>
                  <Button variant="ghost" size="sm" className="text-gray-600" onClick={openSearchOverlay}>
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => simpleUser == null ? router.push("/login") : router.push("/account")}>
                    <UserIcon className="h-5 w-5" />
                  </Button>
                  <a
                    href="https://help.alyawmu.com/hc/ja/requests/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </a>
                  <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>

              </div>
              {/* ナビゲーション */}
              <nav className="px-4 py-3 space-y-2">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block text-gray-600 hover:text-gray-900 py-2 text-sm border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {getLocalizedText(item.text)}
                  </Link>
                ))}
              </nav>
              <MobileLanguageView />
            </div>
          </div>
        )}

        {/* 検索オーバーレイ */}
        {isSearchOverlayOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={closeSearchOverlay}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center p-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder={getLocalizedText(LANGUAGE_LIST.SearchPlaceholder)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    className="pr-12 text-lg py-3"
                    autoFocus
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full bg-gray-200 hover:bg-gray-300"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button
                  onClick={executeSearch}
                  className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}