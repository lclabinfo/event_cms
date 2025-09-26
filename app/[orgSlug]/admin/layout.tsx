import { requireOrganizationAccess } from "@/lib/auth-utils";
import { OrgAdminSidebar } from "@/components/admin/OrgAdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    orgSlug: string;
  }>;
}

async function getOrganization(slug: string) {
  const organization = await prisma.organization.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
    },
  });

  if (!organization) {
    notFound();
  }

  return organization;
}

export default async function OrgAdminLayout({ children, params }: Props) {
  const { orgSlug } = await params;
  const user = await requireOrganizationAccess(orgSlug);
  const organization = await getOrganization(orgSlug);

  return (
    <div className="flex h-screen">
      <OrgAdminSidebar organization={organization} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}