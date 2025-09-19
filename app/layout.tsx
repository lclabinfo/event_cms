import { ReactNode } from 'react';
import { SessionProvider } from '@/components/providers/session-provider';
import './globals.css';

// Root layout - provides SessionProvider for all routes
// HTML/body tags are handled by individual route layouts
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
}