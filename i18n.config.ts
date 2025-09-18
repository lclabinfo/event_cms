export const locales = ['ko', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  es: 'Español',
};

export const localeCurrencies: Record<Locale, string> = {
  ko: 'KRW',
  en: 'USD',
  es: 'EUR',
};

export const localeTimeZones: Record<Locale, string> = {
  ko: 'Asia/Seoul',
  en: 'America/New_York',
  es: 'Europe/Madrid',
};