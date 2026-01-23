// app/profile/page.tsx
import type { Metadata } from 'next';
import ProfileClientPage from './ProfileClientPage';

export const metadata: Metadata = {
  title: 'Mon Profil',
  description: 'Gérez votre profil SecuritySense',
};

export default function ProfilePage() {
  return <ProfileClientPage />;
}