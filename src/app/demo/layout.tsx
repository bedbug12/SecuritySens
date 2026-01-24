// app/scenarios/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demonstration - SecuritySense',
  description: 'Demonstration de l\'utilisation de SecuritySense',
};

export default function ScenariosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children; // Ou ajoutez un layout spécifique
}