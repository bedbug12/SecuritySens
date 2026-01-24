// app/scenarios/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jeux - SecuritySense',
  description: 'Entraînez-vous avec nos jeux d\'ingénierie sociale',
};

export default function ScenariosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children; // Ou ajoutez un layout spécifique
}