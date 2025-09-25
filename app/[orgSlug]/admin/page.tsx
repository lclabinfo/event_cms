import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  Users,
  DollarSign,
  Activity,
  Plus,
  TrendingUp
} from "lucide-react";

interface Props {
  params: {
    orgSlug: string;
  };
}

async function getOrganizationStats(slug: string) {
  const organization = await prisma.organization.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          events: true,
          members: true,
        },
      },
    },
  });

  if (!organization) {
    return null;
  }

  const [
    activeEvents,
    totalRegistrations,
    totalRevenue,
    recentRegistrations
  ] = await Promise.all([
    prisma.event.count({
      where: {
        orgId: organization.id,
        endDate: { gte: new Date() },
      },
    }),
    prisma.registration.count({
      where: {
        event: {
          orgId: organization.id,
        },
      },
    }),
    prisma.registration.aggregate({
      where: {
        event: {
          orgId: organization.id,
        },
        status: "confirmed",
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.registration.count({
      where: {
        event: {
          orgId: organization.id,
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 최근 7일
        },
      },
    }),
  ]);

  return {
    organization,
    stats: {
      totalEvents: organization._count.events,
      activeEvents,
      totalMembers: organization._count.members,
      totalRegistrations,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentRegistrations,
    },
  };
}

export default async function OrgAdminDashboard({ params }: Props) {
  const data = await getOrganizationStats(params.orgSlug);

  if (!data) {
    return <div>기관을 찾을 수 없습니다</div>;
  }

  const { organization, stats } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {organization.name} 대시보드
          </h1>
          <p className="text-gray-600 mt-2">기관 현황을 한눈에 확인하세요</p>
        </div>
        <Button asChild>
          <Link href={`/${params.orgSlug}/admin/events/new`}>
            <Plus className="mr-2 h-4 w-4" />
            새 이벤트 생성
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 이벤트</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEvents} 개 진행 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 등록자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              최근 7일: +{stats.recentRegistrations}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수익</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              확정된 등록 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">팀 멤버</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              관리자 및 스태프
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 주 활동</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              새로운 등록
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">성장률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              전월 대비
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${params.orgSlug}/admin/events`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  이벤트 관리
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${params.orgSlug}/admin/members`}>
                  <Users className="mr-2 h-4 w-4" />
                  팀 관리
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${params.orgSlug}/admin/settings`}>
                  기관 설정
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${params.orgSlug}/admin/analytics`}>
                  통계 보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 이벤트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                최근 생성되거나 업데이트된 이벤트가 표시됩니다
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${params.orgSlug}/admin/events`}>
                  모든 이벤트 보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}