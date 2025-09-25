import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { DomainStatus } from '@prisma/client';

export interface DomainInfo {
  isCustomDomain: boolean;
  domain?: string;
  orgSlug?: string;
  eventSlug?: string;
  eventId?: string;
  orgId?: string;
  isPrimary?: boolean;
  customBranding?: any;
}

/**
 * Extract domain information from request headers
 */
export async function getDomainInfo(): Promise<DomainInfo> {
  const headersList = headers();
  const host = headersList.get('host') || '';

  // Remove port if present
  const domain = host.split(':')[0];

  // Check if this is a custom domain
  const isDefaultDomain =
    domain.includes('localhost') ||
    domain.includes('vercel.app') ||
    domain.includes('your-default-domain.com'); // Replace with your actual domain

  if (isDefaultDomain) {
    return { isCustomDomain: false };
  }

  // Look up custom domain in database
  const customDomain = await checkCustomDomain(domain);

  if (customDomain) {
    return {
      isCustomDomain: true,
      domain: customDomain.domain,
      eventId: customDomain.eventId || undefined,
      orgId: customDomain.orgId,
      isPrimary: customDomain.isPrimary,
      customBranding: customDomain.customBranding,
      orgSlug: customDomain.organization?.slug,
      eventSlug: customDomain.event?.slug
    };
  }

  return { isCustomDomain: false };
}

/**
 * Check if a domain is registered as a custom domain
 */
export async function checkCustomDomain(domain: string) {
  try {
    const customDomain = await prisma.customDomain.findUnique({
      where: {
        domain: domain,
      },
      include: {
        organization: {
          select: {
            slug: true,
            name: true,
          }
        },
        event: {
          select: {
            slug: true,
            title: true,
            orgId: true,
          }
        }
      }
    });

    // Only return if domain is verified and active
    if (customDomain && customDomain.status === DomainStatus.VERIFIED) {
      return customDomain;
    }

    return null;
  } catch (error) {
    console.error('Error checking custom domain:', error);
    return null;
  }
}

/**
 * Get event by domain
 */
export async function getEventByDomain(domain: string) {
  const customDomain = await checkCustomDomain(domain);

  if (!customDomain || !customDomain.eventId) {
    return null;
  }

  const event = await prisma.event.findUnique({
    where: {
      id: customDomain.eventId
    },
    include: {
      organization: true,
      customDomains: {
        where: {
          isPrimary: true,
          status: DomainStatus.VERIFIED
        }
      },
      pages: {
        where: {
          isVisible: true
        },
        orderBy: {
          order: 'asc'
        }
      },
      menus: {
        where: {
          isVisible: true,
          parentId: null
        },
        orderBy: {
          order: 'asc'
        },
        include: {
          children: {
            where: {
              isVisible: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      }
    }
  });

  return event;
}

/**
 * Get organization by domain
 */
export async function getOrganizationByDomain(domain: string) {
  const customDomain = await checkCustomDomain(domain);

  if (!customDomain) {
    return null;
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: customDomain.orgId
    },
    include: {
      events: {
        where: {
          status: 'published',
          visibility: 'public'
        },
        orderBy: {
          startDate: 'asc'
        }
      }
    }
  });

  return organization;
}

/**
 * Build URL with custom domain support
 */
export function buildUrl(
  path: string,
  customDomain?: string,
  locale?: string
): string {
  let baseUrl = '';

  if (customDomain) {
    // Use custom domain
    baseUrl = `https://${customDomain}`;
  } else {
    // Use default domain
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
    baseUrl = `${protocol}://${host}`;
  }

  // Add locale if needed
  if (locale && locale !== 'ko') { // Assuming 'ko' is default
    return `${baseUrl}/${locale}${path}`;
  }

  return `${baseUrl}${path}`;
}

/**
 * Get primary domain for an event
 */
export async function getEventPrimaryDomain(eventId: string) {
  const primaryDomain = await prisma.customDomain.findFirst({
    where: {
      eventId: eventId,
      isPrimary: true,
      status: DomainStatus.VERIFIED
    }
  });

  return primaryDomain?.domain || null;
}

/**
 * Check if current request should redirect to primary domain
 */
export async function shouldRedirectToPrimaryDomain(
  eventId: string,
  currentDomain: string
): Promise<string | null> {
  const primaryDomain = await getEventPrimaryDomain(eventId);

  if (primaryDomain && primaryDomain !== currentDomain) {
    return primaryDomain;
  }

  return null;
}

/**
 * Validate domain ownership
 */
export async function validateDomainOwnership(
  domain: string,
  orgId: string
): Promise<boolean> {
  const customDomain = await prisma.customDomain.findUnique({
    where: {
      domain: domain
    }
  });

  return customDomain?.orgId === orgId;
}