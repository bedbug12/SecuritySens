// app/auth/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentification - SecuritySense',
  description: 'Connectez-vous à votre compte SecuritySense',
  robots: {
    index: false, // Ne pas indexer les pages d'authentification
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}