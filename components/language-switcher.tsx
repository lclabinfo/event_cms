'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, Locale } from '@/i18n.config';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;

    startTransition(() => {
      // Replace the current locale in the pathname
      const segments = pathname.split('/');
      segments[1] = newLocale;
      const newPathname = segments.join('/');

      router.replace(newPathname);
    });
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 hover:border-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === 'ko' && '🇰🇷 '}
            {loc === 'en' && '🇺🇸 '}
            {loc === 'es' && '🇪🇸 '}
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}