import type {Metadata} from "next";
import {NextIntlClientProvider} from 'next-intl';
import "../globals.css";
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: "Yousef Baitalmal | Visionary Engineer & Creator",
  description: "Engineering from First Principles - A revolutionary portfolio showcasing systems language development, UI frameworks, and game engine architecture.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Load messages for the specific locale
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    // Fallback to English messages if locale file not found
    try {
      messages = (await import(`../../messages/en.json`)).default;
    } catch {
      // If even English messages can't be loaded, use empty object
      messages = {};
    }
  }
  
  const isRTL = locale === 'ar';
 
  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
    <body
        suppressHydrationWarning={true}
        className={isRTL ? 'font-almarai' : 'font-comfortaa'}
    >
      <AuthProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </AuthProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'ar'}];
}
