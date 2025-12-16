
"use client"

import { Button } from "@/components/ui/button"
import { useLanguageSession } from "@/providers/language-provider"

export default function MobileLanguageView() {
  const { language, setLanguage } = useLanguageSession()

  const languageList = [
    {language: "ja", text: "Jp"},
    {language: "en", text: "En"},
    {language: "zh", text: "Cn"}
  ]

  return (
    <div className="flex flex-row items-center justify-center">
      {languageList.map((lang, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className={`
            w-12 h-12 text-xs font-medium border-0 relative
            text-gray-600 hover:bg-gray-50
          `}
          onClick={() => setLanguage(lang.language as "ja" | "en" | "zh")}
        >
          {language === lang.language && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#2b2b2b] rounded-full"></div>
            </div>
          )}
          <span className={`relative z-10 ${language === lang.language ? 'text-white' : 'text-gray-600'}`}>
            {lang.text}
          </span>
        </Button>
      ))}
    </div>
  )
}