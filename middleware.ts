import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Create the auth middleware
const authMiddleware = withAuth(
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // Public paths that don't require authentication
        const isPublicPath =
          pathname === '/' ||
          pathname.startsWith('/auth') ||
          pathname.startsWith('/api/public') ||
          // Allow org and event pages to be public
          pathname.match(/^\/[^\/]+$/) || // /[orgSlug]
          pathname.match(/^\/[^\/]+\/[^\/]+/); // /[orgSlug]/[eventSlug]/*

        // Admin paths that require admin role
        const isAdminPath = pathname.startsWith('/admin');

        // Protected paths that require authentication
        const isProtectedPath =
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/profile') ||
          pathname.startsWith('/api/protected');

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

// Custom domain detection and routing
async function handleCustomDomain(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const domain = host.split(':')[0];

  // Check if this is a custom domain (not localhost, vercel.app, or your default domain)
  const isDefaultDomain =
    domain.includes('localhost') ||
    domain.includes('vercel.app') ||
    domain === process.env.NEXT_PUBLIC_DEFAULT_DOMAIN;

  if (!isDefaultDomain) {
    // This is a custom domain - fetch domain info from database
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/domains/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (response.ok) {
        const domainInfo = await response.json();

        if (domainInfo.isValid && domainInfo.eventId) {
          // Custom domain for an event - rewrite to event page
          const locale = req.nextUrl.searchParams.get('locale') || 'ko';
          const path = req.nextUrl.pathname;

          // If at root of custom domain, show event page
          if (path === '/' || path === '') {
            const url = req.nextUrl.clone();
            url.pathname = `/${domainInfo.orgSlug}/${domainInfo.eventSlug}`;

            // Add custom domain info to headers for the page to use
            const response = NextResponse.rewrite(url);
            response.headers.set('x-custom-domain', domain);
            response.headers.set('x-event-id', domainInfo.eventId);
            response.headers.set('x-org-id', domainInfo.orgId);

            if (domainInfo.customBranding) {
              response.headers.set('x-custom-branding', JSON.stringify(domainInfo.customBranding));
            }

            return response;
          }

          // For other paths on custom domain, prefix with org/event slugs
          if (!path.startsWith(`/${domainInfo.orgSlug}/${domainInfo.eventSlug}`)) {
            const url = req.nextUrl.clone();
            url.pathname = `/${domainInfo.orgSlug}/${domainInfo.eventSlug}${path}`;

            const response = NextResponse.rewrite(url);
            response.headers.set('x-custom-domain', domain);
            response.headers.set('x-event-id', domainInfo.eventId);
            response.headers.set('x-org-id', domainInfo.orgId);

            return response;
          }
        } else if (domainInfo.isValid && domainInfo.orgId) {
          // Custom domain for an organization - rewrite to org page
          const path = req.nextUrl.pathname;

          if (path === '/' || path === '') {
            const url = req.nextUrl.clone();
            url.pathname = `/${domainInfo.orgSlug}`;

            const response = NextResponse.rewrite(url);
            response.headers.set('x-custom-domain', domain);
            response.headers.set('x-org-id', domainInfo.orgId);

            return response;
          }

          if (!path.startsWith(`/${domainInfo.orgSlug}`)) {
            const url = req.nextUrl.clone();
            url.pathname = `/${domainInfo.orgSlug}${path}`;

            const response = NextResponse.rewrite(url);
            response.headers.set('x-custom-domain', domain);
            response.headers.set('x-org-id', domainInfo.orgId);

            return response;
          }
        }
      }
    } catch (error) {
      console.error('Error checking custom domain:', error);
    }
  }

  return null;
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Exclude static files and API routes
  const shouldHandle =
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/_vercel') &&
    !pathname.includes('.') &&
    !pathname.startsWith('/demo') &&
    !pathname.startsWith('/auth/test');

  if (!shouldHandle) {
    return NextResponse.next();
  }

  // Check for custom domain first
  const customDomainResponse = await handleCustomDomain(req);
  if (customDomainResponse) {
    return customDomainResponse;
  }

  // Check if authentication is required for this path
  const requiresAuth =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/profile');

  if (requiresAuth) {
    return (authMiddleware as any)(req);
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