import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getTranslations } from 'next-intl/server';

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
      organization: true
    }
  });

  return event;
}

function getLocalizedText(content: any, locale: string = 'ko'): string {
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null) {
    return content[locale] || content['ko'] || Object.values(content)[0] || '';
  }
  return '';
}

export default async function VenuePage({ params, searchParams }: Props) {
  const event = await getEvent(params.orgSlug, params.eventSlug);

  if (!event) {
    notFound();
  }

  const locale = searchParams.locale || event.defaultLocale || 'ko';

  // Get venue information from event data
  const venue = event.venue;
  const venueAddress = event.venueAddress;
  const onlineUrl = event.onlineUrl;

  // If no venue information, show appropriate message
  if (!venue && !onlineUrl) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {locale === 'ko' ? '장소 안내' : 'Venue Information'}
        </h1>
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-gray-600">
            {locale === 'ko'
              ? '장소 정보가 아직 준비되지 않았습니다.'
              : 'Venue information is not available yet.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === 'ko' ? '장소 안내' : 'Venue Information'}
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        {locale === 'ko'
          ? `${event.title} 행사장 안내입니다.`
          : `Venue information for ${event.titleEn || event.title}`}
      </p>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Physical Venue */}
        {venue && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🏢</span>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{venue}</h2>
                  <p className="text-blue-600 mt-1">
                    {locale === 'ko' ? event.title : (event.titleEn || event.title)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.startDate).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {' - '}
                    {new Date(event.endDate).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {venueAddress && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">
                      {locale === 'ko' ? '주소' : 'Address'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      📍 {typeof venueAddress === 'object'
                        ? (venueAddress as any).address || JSON.stringify(venueAddress)
                        : venueAddress}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">
                    {locale === 'ko' ? '교통편' : 'Transportation'}
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{locale === 'ko'
                        ? '대중교통 이용 시 자세한 안내는 등록 후 제공됩니다.'
                        : 'Detailed public transportation information will be provided after registration.'}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    {locale === 'ko' ? '시설 안내' : 'Facilities'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {locale === 'ko' ? '대강당' : 'Main Hall'}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {locale === 'ko' ? '세미나실' : 'Seminar Rooms'}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {locale === 'ko' ? '식당' : 'Restaurant'}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {locale === 'ko' ? '주차장' : 'Parking'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Online Venue */}
        {onlineUrl && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">
              💻 {locale === 'ko' ? '온라인 참가' : 'Online Participation'}
            </h2>
            <p className="text-gray-700 mb-4">
              {locale === 'ko'
                ? '이 행사는 온라인으로도 참가하실 수 있습니다.'
                : 'This event is also available for online participation.'}
            </p>
            <a
              href={onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {locale === 'ko' ? '온라인 참가 링크' : 'Join Online'}
            </a>
          </div>
        )}
      </div>

      {/* Transportation Info */}
      <div className="mt-12 bg-yellow-50 rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-3">
          🚌 {locale === 'ko' ? '교통 안내' : 'Transportation Guide'}
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>• {locale === 'ko'
            ? '공항에서 오시는 길: 등록 후 상세 안내'
            : 'From Airport: Detailed guide after registration'}</li>
          <li>• {locale === 'ko'
            ? '셔틀버스 운행: 주요 지점에서 운행 예정'
            : 'Shuttle Bus: Will operate from major points'}</li>
          <li>• {locale === 'ko'
            ? '숙박 안내: 인근 호텔 정보 제공'
            : 'Accommodation: Nearby hotel information available'}</li>
        </ul>
      </div>

      {/* Map Section */}
      {venueAddress && (
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🗺️</span>
              <p className="text-gray-600">
                {locale === 'ko' ? '지도가 여기 표시됩니다' : 'Map will be displayed here'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register CTA */}
      <div className="mt-8 text-center">
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