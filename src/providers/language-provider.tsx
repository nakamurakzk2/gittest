'use client'

import { Language, MultiLanguageText } from '@/entity/language'
import { createContext, useContext, useState } from 'react'

export type LanguageSessionInfo = {
  setLanguage: (language: 'ja' | 'en' | 'zh') => void
  language: 'ja' | 'en' | 'zh'
  getLocalizedText: (text: MultiLanguageText) => string
}

export const LanguageSessionContext = createContext<LanguageSessionInfo>({
  setLanguage: () => {},
  language: 'ja',
  getLocalizedText: () => '',
})

export const useLanguageSession = () => {
  const context = useContext(LanguageSessionContext)
  if (!context) {
    throw new Error('useLanguageSession must be used within a LanguageSessionProvider')
  }
  return context
}

export function LanguageSessionProvider({ children }: { children: React.ReactNode }) {
  const [ language, setLanguage ] = useState<Language>('ja')

  const getLocalizedText = (text: MultiLanguageText) => {
    if (text == null) {
      return ''
    } else if (text[language] == null || text[language] === '') {
      return text.ja || ''
    } else {
      return text[language]
    }
  }

  return (
    <LanguageSessionContext.Provider value={{setLanguage, language, getLocalizedText}}>
      {children}
    </LanguageSessionContext.Provider>
  )
}