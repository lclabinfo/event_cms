import { ReactNode } from 'react';
import { SessionProvider } from '@/components/providers/session-provider';
import './globals.css';

export const metadata = {
  title: 'Event Platform',
  description: '다국어 지원 이벤트 관리 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}