import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Building2, Users, Calendar, CheckCircle, XCircle } from "lucide-react";

async function getOrganizations() {
  return await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          events: true,
          members: true,
        },
      },
      subscription: {
        select: {
          plan: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">기관 관리</h1>
          <p className="text-gray-600 mt-2">플랫폼에 등록된 모든 기관을 관리합니다</p>
        </div>
        <Button asChild>
          <Link href="/admin/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            새 기관 등록
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {organizations.map((org) => (
          <Card key={org.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <p className="text-sm text-gray-500">/{org.slug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {org.isVerified ? (
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      인증됨
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-gray-400">
                      <XCircle className="mr-1 h-4 w-4" />
                      미인증
                    </span>
                  )}
                  {org.isActive ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                      활성
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                      비활성
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{org._count.events} 이벤트</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{org._count.members} 멤버</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">플랜: </span>
                  <span className="capitalize">{org.subscription?.plan || "FREE"}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">상태: </span>
                  <span className="capitalize">{org.subscription?.status || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">이메일:</span> {org.email}
                  {org.phone && (
                    <>
                      <span className="mx-2">|</span>
                      <span className="font-medium">전화:</span> {org.phone}
                    </>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/organizations/${org.id}`}>
                    상세 보기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {organizations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 기관이 없습니다</p>
            <Button className="mt-4" asChild>
              <Link href="/admin/organizations/new">
                <Plus className="mr-2 h-4 w-4" />
                첫 기관 등록하기
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}