import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, Globe, DollarSign, Info } from 'lucide-react';
import { headers } from 'next/headers';

interface Props {
  params: Promise<{
    orgSlug: string;
    eventSlug: string;
  }>;
  searchParams: Promise<{
    locale?: string;
  }>;
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
      },
      _count: {
        select: {
          registrations: true
        }
      },
      customDomains: {
        where: {
          isPrimary: true,
          status: 'VERIFIED'
        }
      }
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

function formatDate(date: Date, locale: string = 'ko'): string {
  return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

function formatTime(date: Date, locale: string = 'ko'): string {
  return date.toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default async function EventPage({ params, searchParams }: Props) {
  const { orgSlug, eventSlug } = await params;
  const { locale: searchLocale } = await searchParams;
  
  const event = await getEvent(orgSlug, eventSlug);

  if (!event) {
    notFound();
  }

  // Get current locale
  const locale = searchLocale || event.defaultLocale || 'ko';

  // Check if this is a custom domain request
  const headersList = await headers();
  const customDomain = headersList.get('x-custom-domain');
  const baseUrl = customDomain ? '' : `/${orgSlug}/${eventSlug}`;

  // Event dates
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const registrationStart = new Date(event.registrationStart);
  const registrationEnd = new Date(event.registrationEnd);
  const now = new Date();

  // Registration status
  const isRegistrationOpen = now >= registrationStart && now <= registrationEnd;
  const isEventEnded = now > endDate;
  const isEventStarted = now >= startDate;

  // Check if multi-day event
  const isMultiDay = startDate.toDateString() !== endDate.toDateString();

  // Early bird
  const hasEarlyBird = event.earlyBirdEnd && event.earlyBirdPrice;
  const isEarlyBirdActive = hasEarlyBird && now <= new Date(event.earlyBirdEnd!);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {locale === 'ko' ? event.title : (event.titleEn || event.title)}
        </h1>

        {event.description && (
          <p className="text-xl text-gray-600 mb-6">
            {locale === 'ko' ? event.description : (event.descriptionEn || event.description)}
          </p>
        )}

        {/* Event Status Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {isEventEnded && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              종료됨
            </span>
          )}
          {isEventStarted && !isEventEnded && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              진행 중
            </span>
          )}
          {isRegistrationOpen && !isEventEnded && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              등록 가능
            </span>
          )}
          {isEarlyBirdActive && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              얼리버드 할인
            </span>
          )}
        </div>

        {/* CTA Button */}
        {isRegistrationOpen && !isEventEnded && (
          <Button size="lg" asChild className="mb-6">
            <Link href={`${baseUrl}/register`}>
              지금 등록하기
            </Link>
          </Button>
        )}
      </div>

      {/* Event Info Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Date & Time */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              일정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">시작:</span> {formatDate(startDate, locale)}
                <span className="text-gray-500 ml-2">{formatTime(startDate, locale)}</span>
              </div>
              {isMultiDay && (
                <div>
                  <span className="font-medium">종료:</span> {formatDate(endDate, locale)}
                  <span className="text-gray-500 ml-2">{formatTime(endDate, locale)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        {(event.venue || event.onlineUrl) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                장소
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {event.venue && (
                  <div>
                    <p className="font-medium">{event.venue}</p>
                    {event.venueAddress && (
                      <p className="text-gray-500 mt-1">
                        {typeof event.venueAddress === 'object'
                          ? (event.venueAddress as any).address || ''
                          : event.venueAddress}
                      </p>
                    )}
                  </div>
                )}
                {event.onlineUrl && (
                  <div className="mt-2">
                    <a href={event.onlineUrl} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:underline">
                      온라인 참가 링크
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              등록 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">등록 현황:</span>{' '}
                {event._count.registrations}명
                {event.maxParticipants && (
                  <span> / {event.maxParticipants}명</span>
                )}
              </div>
              <div>
                <span className="font-medium">등록 마감:</span>{' '}
                {formatDate(registrationEnd, locale)}
              </div>
              {event.requiresApproval && (
                <div className="text-yellow-600">
                  ※ 승인 필요
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Price Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              참가비
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {isEarlyBirdActive ? (
                <>
                  <div>
                    <span className="font-medium">얼리버드:</span>{' '}
                    <span className="text-lg font-bold text-green-600">
                      {event.currency} {event.earlyBirdPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-500 line-through">
                    정가: {event.currency} {event.basePrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-yellow-600">
                    {new Date(event.earlyBirdEnd!).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}까지
                  </div>
                </>
              ) : (
                <div>
                  <span className="font-medium">정가:</span>{' '}
                  <span className="text-lg font-bold">
                    {event.currency} {event.basePrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Multi-language Support */}
        {event.isMultiLanguage && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                지원 언어
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.supportedLocales.map((loc) => (
                  <span key={loc} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {loc === 'ko' ? '한국어' : loc === 'en' ? 'English' : loc.toUpperCase()}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Info className="h-4 w-4 mr-2" />
                태그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Program Schedule */}
      {event.programs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">프로그램 일정</h2>
          <div className="space-y-4">
            {event.programs.map((program) => (
              <Card key={program.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatTime(new Date(program.startTime), locale)} - {formatTime(new Date(program.endTime), locale)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {locale === 'ko' ? program.title : (program.titleEn || program.title)}
                      </h3>
                      {program.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {program.description}
                        </p>
                      )}
                      {program.location && (
                        <p className="mt-2 text-sm text-gray-500">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {program.location}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      {program.maxCapacity && (
                        <p className="text-sm text-gray-600">
                          정원: {program.currentCount}/{program.maxCapacity}
                        </p>
                      )}
                      {program.price && Number(program.price) > 0 && (
                        <p className="text-sm font-medium mt-1">
                          {event.currency} {Number(program.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      {isRegistrationOpen && !isEventEnded && (
        <div className="text-center py-8 border-t">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            지금 바로 참가 등록을 하세요!
          </h3>
          <Button size="lg" asChild>
            <Link href={`${baseUrl}/register`}>
              등록하기
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}