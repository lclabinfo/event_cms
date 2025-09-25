import { NextRequest, NextResponse } from 'next/server';
import { checkCustomDomain } from '@/lib/domain-utils';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    const customDomain = await checkCustomDomain(domain);

    if (!customDomain) {
      return NextResponse.json({
        isValid: false,
        message: 'Domain not found or not verified'
      });
    }

    return NextResponse.json({
      isValid: true,
      eventId: customDomain.eventId,
      orgId: customDomain.orgId,
      orgSlug: customDomain.organization?.slug,
      eventSlug: customDomain.event?.slug,
      isPrimary: customDomain.isPrimary,
      customBranding: customDomain.customBranding
    });

  } catch (error) {
    console.error('Error checking domain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}