import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string | null;
    organizations?: {
      orgId: string;
      slug: string;
      name: string;
      role: UserRole;
    }[];
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: UserRole;
      organizations?: {
        orgId: string;
        slug: string;
        name: string;
        role: UserRole;
      }[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    organizations?: {
      orgId: string;
      slug: string;
      name: string;
      role: UserRole;
    }[];
  }
}