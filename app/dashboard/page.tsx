import { requireAuth } from "@/lib/auth-utils";
import { UserNav } from "@/components/auth/UserNav";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">대시보드</h1>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            안녕하세요, {user.name}님
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">등록된 이벤트</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">참가 신청</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">결제 대기</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">완료된 결제</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}