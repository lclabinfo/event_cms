import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "@/components/auth/SignInFormIntl";

interface SignInPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export async function generateMetadata({ params }: SignInPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.signin' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SignInPage({ params, searchParams }: SignInPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const t = await getTranslations({ locale, namespace: 'auth.signin' });

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('heading')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('subheading')}
          </p>
        </div>
        <SignInForm callbackUrl={search.callbackUrl} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          {t('noAccount')}{" "}
          <Link
            href={`/${locale}/register`}
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('signupLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}