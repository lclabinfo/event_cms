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
      organization: true
    }
  });

  return event;
}

export default async function SpeakersPage({ params, searchParams }: Props) {
  const event = await getEvent(params.orgSlug, params.eventSlug);

  if (!event) {
    notFound();
  }

  const locale = searchParams.locale || event.defaultLocale || 'ko';

  // Sample speakers data (In production, this would come from database)
  const speakers = [
    {
      name: locale === 'ko' ? '김요셉 목사' : 'Rev. Joseph Kim',
      title: locale === 'ko' ? 'UBF 국제대표' : 'UBF International Director',
      bio: locale === 'ko'
        ? '30년간 캠퍼스 선교에 헌신하며 전 세계 대학생들에게 복음을 전하고 있습니다.'
        : 'Dedicated 30 years to campus mission, spreading the Gospel to university students worldwide.',
      topic: locale === 'ko' ? '말씀과 기도로 새로워지는 삶' : 'Life Renewed Through Word and Prayer',
      image: '/api/placeholder/200/200'
    },
    {
      name: locale === 'ko' ? '사라 아브라함 선교사' : 'Ms. Sarah Abraham',
      title: locale === 'ko' ? '독일 UBF 대표' : 'Germany UBF Director',
      bio: locale === 'ko'
        ? '유럽 캠퍼스 선교의 개척자로 20년간 독일과 유럽 전역에서 사역하고 있습니다.'
        : 'Pioneer of European campus mission, serving in Germany and across Europe for 20 years.',
      topic: locale === 'ko' ? '유럽 선교의 도전과 기회' : 'Challenges and Opportunities in European Mission',
      image: '/api/placeholder/200/200'
    },
    {
      name: locale === 'ko' ? '이사라 선교사' : 'Ms. Sarah Lee',
      title: locale === 'ko' ? '미국 시카고 UBF' : 'Chicago UBF, USA',
      bio: locale === 'ko'
        ? '의료 선교사로서 아프리카와 아시아 지역에서 의료 봉사와 복음 전파에 힘쓰고 있습니다.'
        : 'Medical missionary serving in Africa and Asia, combining medical service with Gospel preaching.',
      topic: locale === 'ko' ? '의료 선교를 통한 복음 전파' : 'Gospel Through Medical Mission',
      image: '/api/placeholder/200/200'
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === 'ko' ? '연사 소개' : 'Speakers'}
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        {locale === 'ko'
          ? '2026 세계선교대회 주요 연사들을 소개합니다.'
          : 'Meet the keynote speakers of the 2026 World Mission Conference.'}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {speakers.map((speaker, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
              <p className="text-blue-600 text-sm mb-3">{speaker.title}</p>
              <p className="text-gray-700 text-sm mb-4">{speaker.bio}</p>
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {locale === 'ko' ? '주제' : 'Topic'}
                </p>
                <p className="text-sm font-semibold">{speaker.topic}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Guests Section */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {locale === 'ko' ? '특별 초청 연사' : 'Special Guest Speakers'}
        </h2>
        <p className="text-gray-700 text-center mb-6">
          {locale === 'ko'
            ? '추가 연사들이 곧 발표될 예정입니다. 계속 확인해 주세요!'
            : 'More speakers will be announced soon. Stay tuned!'}
        </p>
        <div className="text-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {locale === 'ko' ? '업데이트 알림 받기' : 'Get Updates'}
          </button>
        </div>
      </div>

      {/* Register CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          {locale === 'ko'
            ? '이 훌륭한 연사들의 강의를 직접 들어보세요!'
            : 'Join us to hear from these amazing speakers!'}
        </p>
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