// app/dashboard/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tableau de bord - SecuritySense',
  description: 'Votre tableau de bord personnel',
  robots: {
    index: false, // Ne pas indexer les dashboards
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        children
  );
}