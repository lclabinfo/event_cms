"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  CreditCard,
  Settings,
  BarChart,
  Shield,
  Bell,
  FileText
} from "lucide-react";

const navigation = [
  { name: "대시보드", href: "/admin", icon: LayoutDashboard },
  { name: "기관 관리", href: "/admin/organizations", icon: Building2 },
  { name: "사용자 관리", href: "/admin/users", icon: Users },
  { name: "이벤트 관리", href: "/admin/events", icon: Calendar },
  { name: "구독 관리", href: "/admin/subscriptions", icon: CreditCard },
  { name: "분석 및 통계", href: "/admin/analytics", icon: BarChart },
  { name: "보안 설정", href: "/admin/security", icon: Shield },
  { name: "알림 관리", href: "/admin/notifications", icon: Bell },
  { name: "로그 및 감사", href: "/admin/logs", icon: FileText },
  { name: "플랫폼 설정", href: "/admin/settings", icon: Settings },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white">
      <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
        <h2 className="text-xl font-bold">플랫폼 관리자</h2>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="text-xs text-gray-400">
          <p>플랫폼 버전: 1.0.0</p>
          <p>최종 업데이트: 2025.09.25</p>
        </div>
      </div>
    </div>
  );
}