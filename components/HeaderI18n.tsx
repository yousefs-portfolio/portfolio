'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

interface HeaderProps {
  onServicesClick: () => void
}

export default function Header({ onServicesClick }: HeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <a href={`/${locale}`} className="text-xl font-bold tracking-tighter">YOUSEF BAITALMAL</a>
        <nav className="hidden md:flex items-center space-x-8">
          <a href={`/${locale}/blog`} className="hover:text-white transition-colors">Blog</a>
          <button className="hover:text-white transition-colors">Services</button>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
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
      <a href={`/${locale}`} className="text-xl font-bold tracking-tighter">YOUSEF BAITALMAL</a>
      <nav className="hidden md:flex items-center space-x-8">
        <a href={`/${locale}/blog`} className="hover:text-white transition-colors">{t('blog')}</a>
        <button id="services-btn" onClick={onServicesClick} className="hover:text-white transition-colors">{t('services')}</button>
        <a href="#contact" onClick={scrollToContact} className="hover:text-white transition-colors">{t('contact')}</a>
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
