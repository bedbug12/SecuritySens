// app/settings/page.tsx
import type { Metadata } from 'next';
import SettingsClientPage from './SettingsClientPage';

export const metadata: Metadata = {
  title: 'Paramètres',
  description: 'Configurez SecuritySense selon vos préférences',
};

export default function SettingsPage() {
  return <SettingsClientPage />;
}