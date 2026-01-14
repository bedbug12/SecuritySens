'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  HelpCircle,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { CyberButton } from '@/components/ui/CyberButton';

export function Header() {
  const pathname = usePathname();
  const { userProgress } = useProgress();
  const [searchOpen, setSearchOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/') return 'Tableau de bord';
    if (pathname.startsWith('/scenarios')) return 'Scénarios';
    if (pathname.startsWith('/games')) return 'Jeux';
    if (pathname === '/progress') return 'Progression';
    if (pathname === '/demo') return 'Démo';
    if (pathname === '/dashboard') return 'Dashboard Admin';
    return 'SecuritySense';
  };

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-gray-950/95 to-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title and breadcrumb */}
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Formation sécurité</span>
                <span>•</span>
                <span className="text-emerald-400">En ligne</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">{userProgress.vigilanceScore}/100</span>
                <span className="text-xs text-gray-500">vigilance</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Niveau {userProgress.level}</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              
              {searchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Rechercher scénarios, jeux, conseils..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Appuyez sur Esc pour fermer
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action */}
            <CyberButton
              variant="primary"
              size="sm"
              icon={<Zap className="w-4 h-4" />}
              onClick={() => {
                // Action rapide
                window.location.href = '/scenarios';
              }}
            >
              S'entraîner
            </CyberButton>

            {/* Help */}
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative group">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 rounded-xl border border-gray-800 p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <div className="font-medium mb-2">Besoin d'aide ?</div>
                <p className="text-sm text-gray-400 mb-3">
                  Consultez notre guide ou contactez le support
                </p>
                <button className="w-full text-sm text-blue-400 hover:text-blue-300">
                  Voir l'aide
                </button>
              </div>
            </button>

            {/* User menu */}
            <button className="p-1 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold">E</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${userProgress.vigilanceScore}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
        />
      </div>
    </header>
  );
}