import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Create the auth middleware
const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // Remove locale prefix for path checking
        const pathWithoutLocale = locales.reduce((path, locale) => {
          return path.replace(`/${locale}/`, '/').replace(`/${locale}`, '/');
        }, pathname);

        // Public paths that don't require authentication
        const isPublicPath =
          pathWithoutLocale === '/' ||
          pathWithoutLocale.startsWith('/auth') ||
          pathWithoutLocale.startsWith('/events') ||
          pathWithoutLocale.startsWith('/api/public');

        // Admin paths that require admin role
        const isAdminPath = pathWithoutLocale.startsWith('/admin');

        // Protected paths that require authentication
        const isProtectedPath =
          pathWithoutLocale.startsWith('/dashboard') ||
          pathWithoutLocale.startsWith('/profile') ||
          pathWithoutLocale.startsWith('/api/protected');

        // Allow public paths without authentication
        if (isPublicPath) {
          return true;
        }

        // Require authentication for protected paths
        if (isProtectedPath && !token) {
          return false;
        }

        // Require admin role for admin paths
        if (isAdminPath && token?.role !== 'admin') {
          return false;
        }

        return !!token;
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
);

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Exclude static files and API routes that shouldn't be internationalized
  const shouldHandleLocale =
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/_vercel') &&
    !pathname.includes('.') &&
    !pathname.startsWith('/demo');

  if (shouldHandleLocale) {
    // Check if authentication is required for this path
    const pathWithoutLocale = locales.reduce((path, locale) => {
      return path.replace(`/${locale}/`, '/').replace(`/${locale}`, '/');
    }, pathname);

    const requiresAuth =
      pathWithoutLocale.startsWith('/dashboard') ||
      pathWithoutLocale.startsWith('/admin') ||
      pathWithoutLocale.startsWith('/profile');

    if (requiresAuth) {
      return (authMiddleware as any)(req);
    }

    return intlMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!_next|_vercel|.*\\..*).*)',
    '/([\\w-]+)?/users/(.+)'
  ]
};