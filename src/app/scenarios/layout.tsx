// app/scenarios/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scénarios - SecuritySense',
  description: 'Entraînez-vous avec nos scénarios d\'ingénierie sociale réalistes',
};

export default function ScenariosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children; // Ou ajoutez un layout spécifique
}