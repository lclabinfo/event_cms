import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { prisma } from "./db";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();

  if (user.role !== role) {
    redirect("/unauthorized");
  }

  return user;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function getUserWithOrg(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      organization: true,
    },
  });
}

export async function canAccessOrganization(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { orgId: true, role: true },
  });

  if (!user) return false;

  // Admins can access all organizations
  if (user.role === "admin") return true;

  // Users can only access their own organization
  return user.orgId === organizationId;
}

export async function canModifyRegistration(
  userId: string,
  registrationId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, orgId: true },
  });

  if (!user) return false;

  // Admins can modify all registrations
  if (user.role === "admin") return true;

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: { userId: true, orgId: true },
  });

  if (!registration) return false;

  // Users can modify their own registrations
  if (registration.userId === userId) return true;

  // Organization staff can modify registrations in their organization
  if (user.role === "staff" && user.orgId === registration.orgId) return true;

  return false;
}