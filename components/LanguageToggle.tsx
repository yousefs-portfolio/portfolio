'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en')
  }
  
  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold text-sm"
      aria-label="Switch language"
    >
      {t('language.switch')}
    </button>
  )
}
