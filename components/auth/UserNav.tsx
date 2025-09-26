"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserNavProps {
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">대시보드</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/settings">설정</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: "/",
            });
          }}
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}