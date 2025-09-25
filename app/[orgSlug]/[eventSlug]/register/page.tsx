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
      _count: {
        select: { registrations: true }
      }
    }
  });

  return event;
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const event = await getEvent(params.orgSlug, params.eventSlug);

  if (!event) {
    notFound();
  }

  const locale = searchParams.locale || event.defaultLocale || 'ko';

  // Check registration status
  const now = new Date();
  const registrationStart = new Date(event.registrationStart);
  const registrationEnd = new Date(event.registrationEnd);
  const isRegistrationOpen = now >= registrationStart && now <= registrationEnd;
  const isEventEnded = now > new Date(event.endDate);

  // Early bird
  const hasEarlyBird = event.earlyBirdEnd && event.earlyBirdPrice;
  const isEarlyBirdActive = hasEarlyBird && now <= new Date(event.earlyBirdEnd!);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === 'ko' ? '참가 등록' : 'Registration'}
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        {locale === 'ko' ? event.title : (event.titleEn || event.title)}
      </p>

      {!isRegistrationOpen ? (
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              {isEventEnded
                ? (locale === 'ko' ? '행사가 종료되었습니다' : 'Event has ended')
                : now < registrationStart
                ? (locale === 'ko' ? '등록이 아직 시작되지 않았습니다' : 'Registration has not started yet')
                : (locale === 'ko' ? '등록이 마감되었습니다' : 'Registration has closed')}
            </h2>
            {!isEventEnded && now < registrationStart && (
              <p className="text-gray-700">
                {locale === 'ko' ? '등록 시작일: ' : 'Registration starts: '}
                {registrationStart.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Registration Stats */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">{locale === 'ko' ? '현재 등록' : 'Current Registrations'}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {event._count.registrations}
                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{locale === 'ko' ? '등록 마감' : 'Registration Deadline'}</p>
                <p className="text-lg font-semibold">
                  {registrationEnd.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {locale === 'ko' ? '참가비' : 'Registration Fee'}
            </h2>
            {isEarlyBirdActive ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg">{locale === 'ko' ? '얼리버드 가격' : 'Early Bird Price'}</span>
                  <span className="text-2xl font-bold text-green-600">
                    {event.currency} {event.earlyBirdPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-500 line-through">
                  <span>{locale === 'ko' ? '정상 가격' : 'Regular Price'}</span>
                  <span>{event.currency} {event.basePrice.toLocaleString()}</span>
                </div>
                <p className="text-sm text-yellow-600 mt-2">
                  {locale === 'ko' ? '얼리버드 마감: ' : 'Early bird ends: '}
                  {new Date(event.earlyBirdEnd!).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
                </p>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-lg">{locale === 'ko' ? '참가비' : 'Fee'}</span>
                <span className="text-2xl font-bold">
                  {event.currency} {event.basePrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <form className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">
              {locale === 'ko' ? '참가자 정보' : 'Participant Information'}
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ko' ? '이름' : 'Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ko' ? '이메일' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ko' ? '전화번호' : 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ko' ? '소속' : 'Organization'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ko' ? '특별 요청사항' : 'Special Requests'}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={locale === 'ko'
                    ? '식이 제한, 접근성 요구사항 등을 알려주세요'
                    : 'Please let us know about dietary restrictions, accessibility needs, etc.'}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    {locale === 'ko'
                      ? '개인정보 수집 및 이용에 동의합니다. 수집된 정보는 행사 운영 목적으로만 사용됩니다.'
                      : 'I agree to the collection and use of personal information. The collected information will be used only for event operation purposes.'}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  {locale === 'ko' ? '등록하기' : 'Register'}
                </button>
              </div>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              {locale === 'ko'
                ? '문의사항이 있으시면 이메일로 연락주세요: '
                : 'For inquiries, please contact us at: '}
              <a href={`mailto:${event.organization.email}`} className="text-blue-600 hover:underline">
                {event.organization.email}
              </a>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}