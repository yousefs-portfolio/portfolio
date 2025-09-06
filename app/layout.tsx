import type { Metadata } from "next";
import { LanguageProvider } from '@/contexts/LanguageContext';
import LanguageWrapper from '@/components/LanguageWrapper';
import "./globals.css";

export const metadata: Metadata = {
  title: "Yousef Baitalmal | Visionary Engineer & Creator",
  description: "Engineering from First Principles - A revolutionary portfolio showcasing systems language development, UI frameworks, and game engine architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Comfortaa:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <LanguageWrapper>
            {children}
          </LanguageWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
