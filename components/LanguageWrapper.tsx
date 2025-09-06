'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  useEffect(() => {
    // Set the language attribute on the HTML element
    document.documentElement.lang = language
    
    // Set the dir attribute for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    
    // Set the body language attribute as well for CSS targeting
    document.body.setAttribute('lang', language)
  }, [language])

  return <>{children}</>
}
