import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // The default locale
  defaultLocale,

  // Redirect to the default locale if no locale is specified
  localePrefix: 'always',
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Match all pathnames except for
    // - ... if they start with `/api`, `/_next` or `/_vercel`
    // - ... the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',

    // However, match all pathnames within `/users`, including ones with a dot
    '/([\\w-]+)?/users/(.+)'
  ]
};