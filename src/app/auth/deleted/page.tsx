// app/auth/deleted/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Home, UserPlus } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

export const metadata: Metadata = {
  title: 'Compte supprimé',
  robots: 'noindex, nofollow', // Empêcher l'indexation
};

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Compte supprimé</h1>
        
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8">
          <p className="text-gray-400 mb-4">
            Votre compte a été supprimé avec succès. Toutes vos données ont été effacées de nos serveurs.
          </p>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>✓ Toutes vos données personnelles ont été supprimées</p>
            <p>✓ Votre progression a été effacée</p>
            <p>✓ Vos préférences ont été réinitialisées</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <CyberButton
            variant="primary"
            onClick={() => window.location.href = '/'}
            icon={<Home className="w-5 h-5" />}
            className="w-full"
          >
            Retour à l'accueil
          </CyberButton>
          
          <CyberButton
            variant="outline"
            onClick={() => window.location.href = '/auth/signup'}
            icon={<UserPlus className="w-5 h-5" />}
            className="w-full"
          >
            Créer un nouveau compte
          </CyberButton>
        </div>
        
        <p className="text-xs text-gray-500 mt-8">
          Si vous avez changé d'avis, vous pouvez créer un nouveau compte à tout moment.
          Votre ancienne progression ne pourra pas être restaurée.
        </p>
      </div>
    </div>
  );
}