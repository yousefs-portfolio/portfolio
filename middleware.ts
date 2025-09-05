import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Don't redirect on the root path
  localePrefix: 'as-needed'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|ar)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)', '/((?!keystatic).*)']
};
