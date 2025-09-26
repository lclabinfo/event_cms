"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@prisma/client";

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
  role?: string;
}

export function useAuth({
  redirectTo = "/auth/signin",
  redirectIfFound = false,
  role,
}: UseAuthOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const loading = status === "loading";

  useEffect(() => {
    if (loading) return;

    if (
      (!redirectIfFound && !user) ||
      (redirectIfFound && user)
    ) {
      router.push(redirectTo);
    }

    if (role && user && user.role !== role) {
      router.push("/unauthorized");
    }
  }, [user, loading, redirectIfFound, redirectTo, role, router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ORG_ADMIN,
    isStaff: user?.role === UserRole.ORG_STAFF,
    session,
  };
}

export function useRequireAuth(options?: UseAuthOptions) {
  const auth = useAuth(options);

  if (auth.loading) {
    return { ...auth, isReady: false };
  }

  if (!auth.user) {
    return { ...auth, isReady: false };
  }

  return { ...auth, isReady: true };
}