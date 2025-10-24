'use client'

import {useCallback, useEffect, useState} from 'react'
import Link from 'next/link'
import {useLocale, useTranslations} from 'next-intl'
import {useRouter} from 'next/navigation'
import LocaleLanguageToggle from './LocaleLanguageToggle'

interface HeaderProps {
  onServicesClick: () => void
}

export default function LocaleHeader({onServicesClick}: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const isArabic = locale === 'ar'
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', { cache: 'no-store' })
      if (!response.ok) {
        setIsAdmin(false)
        return
      }
      const data = await response.json()
      setIsAdmin(Boolean(data.authenticated))
    } catch {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    const handleFocus = () => {
      checkSession()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [checkSession])

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({behavior: 'smooth'})
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    } finally {
      setIsAdmin(false)
      router.refresh()
    }
  }

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-xl font-bold tracking-tighter">YOUSEF BAITALMAL</Link>
        <nav className={`hidden md:flex items-center ${isArabic ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">{t('nav.blog')}</Link>
          <button className="hover:text-white transition-colors">{t('nav.services')}</button>
          <a href="#contact" className="hover:text-white transition-colors">{t('nav.contact')}</a>
          <LocaleLanguageToggle/>
        </nav>
        <button className="md:hidden z-50">
          <div className="w-6 h-6"></div>
        </button>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
      <Link href={`/${locale}`} className="text-xl font-bold tracking-tighter">YOUSEF BAITALMAL</Link>
      <nav className={`hidden md:flex items-center ${isArabic ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
        <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">{t('nav.blog')}</Link>
        <button id="services-btn" onClick={onServicesClick}
                className="hover:text-white transition-colors">{t('nav.services')}</button>
        <a href="#contact" onClick={scrollToContact}
           className="hover:text-white transition-colors">{t('nav.contact')}</a>
        {isAdmin && (
          <>
            <Link href="/admin" className="hover:text-white transition-colors">{t('nav.admin')}</Link>
            <button onClick={handleLogout} className="hover:text-white transition-colors">{t('nav.logout')}</button>
          </>
        )}
        <LocaleLanguageToggle/>
      </nav>
      <button className="md:hidden z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </header>
  )
}
