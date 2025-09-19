import type {Metadata} from "next";
import {NextIntlClientProvider} from 'next-intl';
import "../globals.css";

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
  } catch (error) {
    // Fallback to English messages if locale file not found
    try {
      messages = (await import(`../../messages/en.json`)).default;
    } catch (fallbackError) {
      // If even English messages can't be loaded, use empty object
      messages = {};
    }
  }
  
  const isRTL = locale === 'ar';
 
  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Inter:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true} className={isRTL ? 'font-almarai' : 'font-inter'}>
      <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'ar'}];
}
