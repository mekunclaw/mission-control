import type { Metadata } from 'next';
import './globals.css';
import 'nes.css/css/nes.min.css';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Agent Workforce Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-pixel-dark">{children}</body>
    </html>
  );
}
