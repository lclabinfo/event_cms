import { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "로그인",
  description: "계정에 로그인하여 서비스를 이용하세요",
};

interface SignInPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          <p className="text-sm text-muted-foreground">
            이메일과 비밀번호를 입력하여 로그인하세요
          </p>
        </div>
        <SignInForm callbackUrl={searchParams.callbackUrl} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            href="/auth/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}