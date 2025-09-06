'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const translations = {
  en: {
    // Navigation
    'nav.blog': 'Blog',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title1': 'Engineering',
    'hero.title2': 'from First Principles.',
    'hero.subtitle': 'Scroll to begin a journey through my stack — from the foundational logic of a systems language to the vibrant pixels of a game engine.',
    
    // Projects
    'projects.layer1': 'LAYER 1',
    'projects.layer1Name': 'THE LANGUAGE',
    'projects.layer2': 'LAYER 2',
    'projects.layer2Name': 'THE FRAMEWORK',
    'projects.layer3': 'LAYER 3',
    'projects.layer3Name': 'THE EXPERIENCE',
    'projects.loading': 'Loading projects...',
    
    // Contact
    'contact.title': "Let's Build.",
    'contact.subtitle': "If you're working on revolutionary products, I'd love to talk.",
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    
    // Language
    'language.switch': 'عربي'
  },
  ar: {
    // Navigation
    'nav.blog': 'المدونة',
    'nav.services': 'الخدمات',
    'nav.contact': 'اتصل بنا',
    
    // Hero
    'hero.title1': 'الهندسة',
    'hero.title2': 'من المبادئ الأولى.',
    'hero.subtitle': 'انتقل للأسفل لبدء رحلة عبر مكدسي التقني — من المنطق الأساسي للغة الأنظمة إلى البكسلات النابضة بالحياة لمحرك الألعاب.',
    
    // Projects
    'projects.layer1': 'الطبقة 1',
    'projects.layer1Name': 'اللغة',
    'projects.layer2': 'الطبقة 2',
    'projects.layer2Name': 'الإطار',
    'projects.layer3': 'الطبقة 3',
    'projects.layer3Name': 'التجربة',
    'projects.loading': 'جاري تحميل المشاريع...',
    
    // Contact
    'contact.title': 'دعنا نبني.',
    'contact.subtitle': 'إذا كنت تعمل على منتجات ثورية، أود أن أتحدث معك.',
    'contact.form.name': 'الاسم',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال الرسالة',
    
    // Language
    'language.switch': 'English'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with 'en' for SSR, will update on client
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedLang = localStorage.getItem('language') as Language
      if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
        setLanguage(savedLang)
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = savedLang
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase()
        const detectedLang = browserLang.startsWith('ar') ? 'ar' : 'en'
        setLanguage(detectedLang)
        document.documentElement.dir = detectedLang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = detectedLang
        localStorage.setItem('language', detectedLang)
      }
    }
  }, [])
  
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
  }
  
  const t = (key: string): string => {
    // Return English by default during SSR
    const dict: Record<string, string> = mounted ? translations[language] : translations['en']
    return dict[key] ?? key
  }
  
  const value = {
    language: mounted ? language : 'en',
    setLanguage: handleSetLanguage,
    t,
    dir: (mounted && language === 'ar') ? 'rtl' as const : 'ltr' as const
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
