import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar, Users, Eye, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  params: {
    orgSlug: string;
  };
}

async function getOrganizationEvents(slug: string) {
  const organization = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!organization) return [];

  const events = await prisma.event.findMany({
    where: {
      orgId: organization.id,
    },
    include: {
      _count: {
        select: {
          registrations: true,
          programs: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return events;
}

export default async function OrgEventsPage({ params }: Props) {
  const events = await getOrganizationEvents(params.orgSlug);

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded ${
          styles[status as keyof typeof styles] || styles.draft
        }`}
      >
        {status === "draft" && "초안"}
        {status === "published" && "게시됨"}
        {status === "cancelled" && "취소됨"}
        {status === "completed" && "완료됨"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">이벤트 관리</h1>
          <p className="text-gray-600 mt-2">기관의 모든 이벤트를 관리합니다</p>
        </div>
        <Button asChild>
          <Link href={`/${params.orgSlug}/admin/events/new`}>
            <Plus className="mr-2 h-4 w-4" />
            새 이벤트
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  {event.titleEn && (
                    <p className="text-sm text-gray-500 mt-1">{event.titleEn}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(event.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/${params.orgSlug}/admin/events/${event.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          편집
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/${params.orgSlug}/${event.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          미리보기
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">시작일</p>
                  <p className="font-medium">
                    {new Date(event.startDate).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">종료일</p>
                  <p className="font-medium">
                    {new Date(event.endDate).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">등록자</p>
                  <p className="font-medium">
                    {event._count.registrations}
                    {event.maxParticipants && ` / ${event.maxParticipants}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">프로그램</p>
                  <p className="font-medium">{event._count.programs}개</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {event.venue && (
                    <span>📍 {event.venue}</span>
                  )}
                  {event.onlineUrl && (
                    <span>💻 온라인</span>
                  )}
                  <span>💰 ₩{event.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${params.orgSlug}/admin/events/${event.id}/registrations`}>
                      <Users className="mr-2 h-4 w-4" />
                      참가자
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/${params.orgSlug}/admin/events/${event.id}`}>
                      관리
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">아직 생성된 이벤트가 없습니다</p>
            <Button className="mt-4" asChild>
              <Link href={`/${params.orgSlug}/admin/events/new`}>
                <Plus className="mr-2 h-4 w-4" />
                첫 이벤트 만들기
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}