// app/scenarios/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progression - SecuritySense',
  description: 'Suivi de votre progression dans SecuritySense',
};

export default function ScenariosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children; // Ou ajoutez un layout spécifique
}