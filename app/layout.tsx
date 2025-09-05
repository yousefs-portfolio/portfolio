import type { Metadata } from "next";
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
