import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, MapPin, Users, Globe, Settings } from 'lucide-react';
import { headers } from 'next/headers';

interface Props {
  params: Promise<{
    orgSlug: string;
  }>;
}

async function getOrganization(slug: string) {
  const organization = await prisma.organization.findUnique({
    where: { slug },
    include: {
      events: {
        where: {
          status: 'published',
          visibility: 'public',
        },
        orderBy: {
          startDate: 'asc',
        },
        include: {
          _count: {
            select: { registrations: true }
          }
        }
      },
      _count: {
        select: { events: true }
      }
    }
  });

  return organization;
}

export default async function OrganizationPage({ params }: Props) {
  const { orgSlug } = await params;
  const organization = await getOrganization(orgSlug);

  if (!organization) {
    notFound();
  }

  // Check if this is a custom domain request
  const headersList = await headers();
  const customDomain = headersList.get('x-custom-domain');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Organization Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-5">
            {organization.logo && (
              <div className="flex-shrink-0">
                <img
                  className="h-20 w-20 rounded-lg object-cover"
                  src={organization.logo}
                  alt={organization.name}
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {organization.name}
              </h1>
              {organization.description && (
                <p className="mt-2 text-lg text-gray-600">
                  {organization.description}
                </p>
              )}
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                {organization.email && (
                  <a href={`mailto:${organization.email}`} className="hover:text-gray-700">
                    {organization.email}
                  </a>
                )}
                {organization.phone && (
                  <span>{organization.phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">진행 예정 이벤트</h2>
          <p className="mt-2 text-gray-600">
            {organization.name}에서 주최하는 이벤트에 참여해보세요
          </p>
        </div>

        {organization.events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organization.events.map((event) => {
              const eventDate = new Date(event.startDate);
              const isMultiDay = new Date(event.endDate).getDate() !== eventDate.getDate();

              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {event.title}
                    </CardTitle>
                    {event.titleEn && (
                      <CardDescription className="line-clamp-1">
                        {event.titleEn}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          {eventDate.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {isMultiDay && (
                            <> ~ {new Date(event.endDate).toLocaleDateString('ko-KR', {
                              month: 'long',
                              day: 'numeric'
                            })}</>
                          )}
                        </span>
                      </div>

                      {event.venue && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      )}

                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          {event._count.registrations}명 등록
                          {event.maxParticipants && (
                            <> / {event.maxParticipants}명</>
                          )}
                        </span>
                      </div>

                      {event.isMultiLanguage && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>다국어 지원</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button asChild className="w-full">
                        <Link href={customDomain ? `/${event.slug}` : `/${orgSlug}/${event.slug}`}>
                          자세히 보기
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">현재 진행 예정인 이벤트가 없습니다.</p>
            </CardContent>
          </Card>
        )}

        {/* Organization Stats */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 이벤트</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organization._count.events}</div>
              <p className="text-xs text-muted-foreground">
                개최된 이벤트 수
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">활성 이벤트</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {organization.events.filter(e => new Date(e.endDate) >= new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">
                현재 진행 중인 이벤트
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">설립 연도</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(organization.createdAt).getFullYear()}
              </div>
              <p className="text-xs text-muted-foreground">
                Since {new Date(organization.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © 2025 {organization.name}. All rights reserved.
              </p>
              {organization.email && (
                <p className="text-sm text-gray-400 mt-1">
                  문의: {organization.email}
                  {organization.phone && ` | ${organization.phone}`}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                이용약관
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                개인정보처리방침
              </Link>
              <Link
                href={`/${orgSlug}/admin`}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white"
                title="기관 관리자"
              >
                <Settings className="h-4 w-4" />
                <span className="ml-1">관리자</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}