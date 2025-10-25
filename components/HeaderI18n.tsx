'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {useLocale, useTranslations} from 'next-intl'
import {signOut, useSession} from 'next-auth/react'
import LanguageSwitcher from './LanguageSwitcher'

interface HeaderProps {
  onServicesClick: () => void
}

export default function Header({ onServicesClick }: HeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isAdmin = status === 'authenticated' && Boolean(session?.user?.isAdmin)

    const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = () => {
    void signOut({ callbackUrl: `/${locale}` })
  }

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
          <Link href={`/${locale}`} className="text-xl font-bold tracking-tighter">YOUSEF BAITALMAL</Link>
        <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">Blog</Link>
            <button type="button" onClick={onServicesClick} className="hover:text-white transition-colors">Services
            </button>
            <button type="button" onClick={scrollToContact} className="hover:text-white transition-colors">Contact
            </button>
          <LanguageSwitcher />
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
      <nav className="hidden md:flex items-center space-x-8">
          <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">{t('blog')}</Link>
          <button id="services-btn" type="button" onClick={onServicesClick}
                  className="hover:text-white transition-colors">{t('services')}</button>
          <button type="button" onClick={scrollToContact}
                  className="hover:text-white transition-colors">{t('contact')}</button>
        {isAdmin && (
          <>
              <Link href="/admin" className="hover:text-white transition-colors">{t('admin')}</Link>
              <button type="button" onClick={handleLogout}
                      className="hover:text-white transition-colors">{t('logout')}</button>
          </>
        )}
        <LanguageSwitcher />
      </nav>
      <button id="mobile-menu-btn" className="md:hidden z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </header>
  )
}
