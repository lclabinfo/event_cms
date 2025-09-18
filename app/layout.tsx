import { ReactNode } from 'react';

// Since we have locale-specific layouts,
// this root layout should only pass through children
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}