'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';

export function Navigation() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={`/${locale}`} className="font-bold text-xl">
              UBF Events
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href={`/${locale}`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/schedule`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {t('schedule')}
              </Link>
              <Link
                href={`/${locale}/speakers`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {t('speakers')}
              </Link>
              <Link
                href={`/${locale}/venue`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {t('venue')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/login`}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('register')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}