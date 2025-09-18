import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const currentLocale = locale as Locale;

  if (!currentLocale || !locales.includes(currentLocale)) {
    notFound();
  }

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default
  };
});