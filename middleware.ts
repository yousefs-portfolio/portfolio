import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { locales, routing } from '@/i18n/routing';

const defaultLocale = 'en';

// Create the next-intl middleware with the routing configuration
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAdmin = Boolean(token && typeof token === 'object' && 'isAdmin' in token && (token as any).isAdmin);

    if (!isAdmin) {
      if (pathname.startsWith('/api/keystatic')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Check if pathname is for API routes, static files, or special Next.js paths
  const shouldNotRedirect =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') || // Has file extension
    pathname.startsWith('/favicon');

  if (shouldNotRedirect) {
    return NextResponse.next();
  }

  // Check if the pathname already includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If root path, redirect to default locale or browser preference
  if (pathname === '/') {
    // Get browser's preferred language
    const acceptLanguage = request.headers.get('accept-language') || '';
    const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();

    // Always default to English unless explicit Arabic preference
    const preferredLocale = browserLang === 'ar' ? 'ar' : defaultLocale;

    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  // If no locale in pathname, use intl middleware to add it
  if (!pathnameHasLocale) {
    // Get browser's preferred language
    const acceptLanguage = request.headers.get('accept-language') || '';
    const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();

    // Always default to English unless explicit Arabic preference
    const preferredLocale = browserLang === 'ar' ? 'ar' : defaultLocale;

    // Redirect to the localized version
    const newUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Use the intl middleware for localized routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|ar)/:path*']
};
