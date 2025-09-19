'use client'

import {usePathname, useRouter} from '@/i18n/routing'
import {useLocale} from 'next-intl'
import {useTransition} from 'react'

export default function LocaleLanguageToggle() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'

    startTransition(() => {
      // Use next-intl's proper navigation method
      router.replace(pathname, {locale: newLocale})

      // Set cookie for preference
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    })
  }

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className={`px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold text-sm ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Switch language"
    >
      {locale === 'en' ? 'عربي' : 'English'}
    </button>
  )
}