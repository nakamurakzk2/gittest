
"use client"

import { Button } from "@/components/ui/button"
import { useLanguageSession } from "@/providers/language-provider"

export default function LanguageView() {
  const { language, setLanguage } = useLanguageSession()

  const languageList = [
    {language: "ja", text: "Jp"},
    {language: "en", text: "En"},
    {language: "zh", text: "Cn"}
  ]

  return (
    <div className="hidden md:block fixed left-[30px] top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col bg-white border border-gray-200 rounded-full shadow-lg overflow-hidden">
        {languageList.map((lang, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`
              w-12 h-12 text-xs font-medium border-0 relative
              ${index === 0 ? 'rounded-tr-2xl' : ''}
              ${index === languageList.length - 1 ? 'rounded-br-2xl' : 'border-b border-gray-100'}
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
    </div>
  )
}