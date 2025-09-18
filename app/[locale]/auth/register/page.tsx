import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/components/auth/RegisterFormIntl";

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register' });

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('heading')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('subheading')}
          </p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          {t('hasAccount')}{" "}
          <Link
            href={`/${locale}/auth/signin`}
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('signinLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}