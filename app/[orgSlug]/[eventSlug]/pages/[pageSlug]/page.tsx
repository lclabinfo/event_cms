import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

interface Props {
  params: Promise<{
    orgSlug: string;
    eventSlug: string;
    pageSlug: string;
  }>;
  searchParams: Promise<{
    locale?: string;
  }>;
}

async function getEventPage(eventId: string, pageSlug: string) {
  const page = await prisma.eventPage.findFirst({
    where: {
      eventId,
      slug: pageSlug,
      isVisible: true
    }
  });

  return page;
}

async function getEvent(orgSlug: string, eventSlug: string) {
  const event = await prisma.event.findFirst({
    where: {
      slug: eventSlug,
      organization: {
        slug: orgSlug
      }
    },
    select: {
      id: true,
      defaultLocale: true,
      supportedLocales: true
    }
  });

  return event;
}

function getLocalizedContent(content: any, locale: string = 'ko'): { title: string; body: string } {
  if (typeof content === 'object' && content !== null) {
    return {
      title: content.title?.[locale] || content.title?.['ko'] || '',
      body: content.content?.[locale] || content.content?.['ko'] || ''
    };
  }
  return { title: '', body: '' };
}

export default async function DynamicEventPage({ params, searchParams }: Props) {
  const { orgSlug, eventSlug, pageSlug } = await params;
  const { locale: searchLocale } = await searchParams;
  
  const event = await getEvent(orgSlug, eventSlug);

  if (!event) {
    notFound();
  }

  const page = await getEventPage(event.id, pageSlug);

  if (!page) {
    notFound();
  }

  const locale = searchLocale || event.defaultLocale || 'ko';
  const { title, body } = getLocalizedContent({ title: page.title, content: page.content }, locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {title}
        </h1>

        {/* Render HTML content safely */}
        <div
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </article>
    </div>
  );
}