import { ReactNode } from 'react';
import { SessionProvider } from '@/components/providers/session-provider';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}