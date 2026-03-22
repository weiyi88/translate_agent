'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations, type Language, type TranslationKeys } from './translations'

type TranslationContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
  toggleLanguage: () => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh')

  useEffect(() => {
    // Load saved language preference from localStorage
    const saved = localStorage.getItem('language') as Language | null
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }, [language, setLanguage])

  const t = translations[language] as TranslationKeys

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

// Export a hook to get specific translation section
export function useT<K extends keyof TranslationKeys>(section: K): TranslationKeys[K] {
  const { t } = useTranslation()
  return t[section]
}
