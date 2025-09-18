import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "회원가입",
  description: "새 계정을 만들어 서비스를 이용하세요",
};

interface RegisterPageProps {
  searchParams: {
    orgId?: string;
  };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">회원가입</h1>
          <p className="text-sm text-muted-foreground">
            계정을 만들어 서비스를 시작하세요
          </p>
        </div>
        <RegisterForm orgId={searchParams.orgId} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/auth/signin"
            className="underline underline-offset-4 hover:text-primary"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}