import {getRequestConfig} from 'next-intl/server';
import {routing} from '@/i18n/routing';

export default getRequestConfig(async (context) => {
  // Get locale from context, with fallback to 'en'
  const locale = context.locale || 'en';

  // Validate that the incoming locale parameter is valid
  const finalLocale = routing.locales.includes(locale as any) ? locale : 'en';

  try {
    const messages = (await import(`./messages/${finalLocale}.json`)).default;
    return {
      messages,
      locale: finalLocale
    };
  } catch (error) {
    // Fallback to English messages if locale file not found
    const messages = (await import(`./messages/en.json`)).default;
    return {
      messages,
      locale: 'en'
    };
  }
});
