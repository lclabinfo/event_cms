"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  BarChart,
  CreditCard,
  Globe,
  Mail
} from "lucide-react";

interface OrgAdminSidebarProps {
  organization: {
    id: string;
    slug: string;
    name: string;
    logo?: string | null;
  };
}

export function OrgAdminSidebar({ organization }: OrgAdminSidebarProps) {
  const pathname = usePathname();
  const baseUrl = `/${organization.slug}/admin`;

  const navigation = [
    { name: "대시보드", href: baseUrl, icon: LayoutDashboard },
    { name: "이벤트 관리", href: `${baseUrl}/events`, icon: Calendar },
    { name: "참가자 관리", href: `${baseUrl}/registrations`, icon: Users },
    { name: "팀 멤버", href: `${baseUrl}/members`, icon: Users },
    { name: "페이지 관리", href: `${baseUrl}/pages`, icon: FileText },
    { name: "이메일 템플릿", href: `${baseUrl}/emails`, icon: Mail },
    { name: "도메인 관리", href: `${baseUrl}/domains`, icon: Globe },
    { name: "결제 관리", href: `${baseUrl}/payments`, icon: CreditCard },
    { name: "통계 및 분석", href: `${baseUrl}/analytics`, icon: BarChart },
    { name: "기관 설정", href: `${baseUrl}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {organization.name[0]}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold text-gray-900">{organization.name}</h2>
            <p className="text-xs text-gray-500">관리자 패널</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== baseUrl && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <Link
          href={`/${organization.slug}`}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Globe className="mr-2 h-4 w-4" />
          공개 페이지 보기
        </Link>
      </div>
    </div>
  );
}