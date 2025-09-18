import { ReactNode } from 'react';
import './globals.css';

// Root layout for non-localized pages (like /demo)
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if we're in a localized route
  // If so, just pass through (the [locale]/layout.tsx will handle it)
  // Otherwise, provide the HTML structure for non-localized pages
  return children;
}