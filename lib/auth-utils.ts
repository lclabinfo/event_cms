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
  const user = await requireAuth();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  return user;
}

export async function requireSuperAdmin() {
  const user = await requireAuth();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  return user;
}

export async function getUserOrganizations(userId: string) {
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId,
      isActive: true,
    },
    include: {
      organization: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  });

  return memberships.map((membership) => ({
    orgId: membership.organization.id,
    slug: membership.organization.slug,
    name: membership.organization.name,
    role: membership.role,
  }));
}

export async function canAccessOrganizationAdmin(
  userId: string,
  organizationSlug: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return false;

  // Super admins can access all organizations
  if (user.role === "SUPER_ADMIN") return true;

  // Check if user is a member of the organization with admin privileges
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        slug: organizationSlug,
      },
      isActive: true,
      role: {
        in: ["ORG_OWNER", "ORG_ADMIN", "ORG_STAFF"],
      },
    },
  });

  return !!membership;
}

export async function canAccessOrganization(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return false;

  // Super admins can access all organizations
  if (user.role === "SUPER_ADMIN") return true;

  // Check if user is a member of the organization
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      orgId: organizationId,
      isActive: true,
    },
  });

  return !!membership;
}

export async function canModifyRegistration(
  userId: string,
  registrationId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) return false;

  // Super admins can modify all registrations
  if (user.role === "SUPER_ADMIN") return true;

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: {
      userId: true,
      event: {
        select: {
          orgId: true
        }
      }
    },
  });

  if (!registration) return false;

  // Users can modify their own registrations
  if (registration.userId === userId) return true;

  // Check if user is an admin of the organization
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      orgId: registration.event.orgId,
      isActive: true,
      role: {
        in: ["ORG_OWNER", "ORG_ADMIN", "ORG_STAFF"],
      },
    },
  });

  return !!membership;
}

export async function requireOrganizationAccess(orgSlug: string) {
  const user = await requireAuth();

  const hasAccess = await canAccessOrganizationAdmin(user.id, orgSlug);

  if (!hasAccess) {
    redirect("/unauthorized");
  }

  return user;
}