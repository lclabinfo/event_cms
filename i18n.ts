import { getRequestConfig } from 'next-intl/server';
import { Locale, locales } from './i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    locale = 'ko';
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});