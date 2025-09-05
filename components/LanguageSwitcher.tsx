'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    
    startTransition(() => {
      // Replace the locale in the pathname
      const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
      router.push(newPathname);
    });
  };

  return (
    <button
      onClick={switchLanguage}
      disabled={isPending}
      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
      aria-label="Switch language"
    >
      {locale === 'en' ? 'عربي' : 'English'}
    </button>
  );
}
