import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '../i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined, use default locale
  if (!locale) {
    const defaultMessages = (await import(`../messages/en.json`)).default;
    return {
      locale: 'en',
      messages: defaultMessages
    };
  }

  // Validate that the incoming `locale` parameter is valid
  const currentLocale = locale as Locale;

  if (!locales.includes(currentLocale)) {
    console.error('Invalid locale:', currentLocale);
    notFound();
  }

  try {
    const messages = (await import(`../messages/${currentLocale}.json`)).default;
    return {
      locale: currentLocale,
      messages
    };
  } catch (error) {
    console.error('Error loading messages for locale:', currentLocale, error);
    notFound();
  }
});