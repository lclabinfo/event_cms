import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

interface Props {
  params: {
    orgSlug: string;
    eventSlug: string;
  };
  searchParams: {
    locale?: string;
  };
}

async function getEvent(orgSlug: string, eventSlug: string) {
  const event = await prisma.event.findFirst({
    where: {
      slug: eventSlug,
      organization: {
        slug: orgSlug
      }
    },
    include: {
      organization: true,
      programs: {
        orderBy: {
          startTime: 'asc'
        }
      }
    }
  });

  return event;
}

function formatTime(date: Date, locale: string = 'ko'): string {
  return date.toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDate(date: Date, locale: string = 'ko'): string {
  return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function SchedulePage({ params, searchParams }: Props) {
  const event = await getEvent(params.orgSlug, params.eventSlug);

  if (!event) {
    notFound();
  }

  const locale = searchParams.locale || event.defaultLocale || 'ko';

  // Group programs by date
  const programsByDate = event.programs.reduce((acc: any, program) => {
    const dateKey = new Date(program.startTime).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(program);
    return acc;
  }, {});

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === 'ko' ? '일정표' : 'Schedule'}
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        {locale === 'ko'
          ? `${event.title} 전체 일정입니다.`
          : `Complete schedule for ${event.titleEn || event.title}`}
      </p>

      {Object.keys(programsByDate).length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {Object.entries(programsByDate).map(([dateKey, programs]: [string, any]) => (
            <div key={dateKey} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                {formatDate(new Date(dateKey), locale)}
              </h2>
              <div className="space-y-4">
                {programs.map((program: any) => (
                  <div key={program.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gray-600">
                            {formatTime(new Date(program.startTime), locale)} - {formatTime(new Date(program.endTime), locale)}
                          </span>
                          {program.code && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {program.code}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                          {locale === 'ko' ? program.title : (program.titleEn || program.title)}
                        </h3>
                        {program.description && (
                          <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                        )}
                        {program.location && (
                          <p className="text-sm text-gray-500">
                            📍 {program.location}
                          </p>
                        )}
                      </div>
                      {program.maxCapacity && (
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-600">
                            {locale === 'ko' ? '정원' : 'Capacity'}: {program.currentCount}/{program.maxCapacity}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">
            {locale === 'ko'
              ? '상세 일정이 곧 공개될 예정입니다.'
              : 'Detailed schedule will be announced soon.'}
          </p>
        </div>
      )}

      {/* Download Schedule */}
      <div className="mt-12 text-center">
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors mr-4">
          {locale === 'ko' ? '📥 일정표 다운로드' : '📥 Download Schedule'}
        </button>
        <a
          href={`/${params.orgSlug}/${params.eventSlug}/register${searchParams.locale ? `?locale=${searchParams.locale}` : ''}`}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          {locale === 'ko' ? '지금 등록하기' : 'Register Now'}
        </a>
      </div>
    </main>
  );
}