'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Shield,
  Gamepad2,
  TrendingUp,
  Play,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Bell
} from 'lucide-react';
import { useProgress } from '@/lib/contexts/ProgressContext';

export function Navigation() {
  const pathname = usePathname();
  const { userProgress } = useProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Détecter si on est sur mobile (uniquement côté client)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Sur desktop, le menu est toujours ouvert
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    // Vérifier immédiatement
    checkMobile();
    
    // Écouter les changements de taille
    window.addEventListener('resize', checkMobile);
    
    // Nettoyer
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { path: '/', label: 'Accueil', icon: <Home className="w-5 h-5" /> },
    { path: '/scenarios', label: 'Scénarios', icon: <Shield className="w-5 h-5" /> },
    { path: '/games', label: 'Jeux', icon: <Gamepad2 className="w-5 h-5" /> },
    { path: '/progress', label: 'Progression', icon: <TrendingUp className="w-5 h-5" /> },
    { path: '/demo', label: 'Démo', icon: <Play className="w-5 h-5" /> },
  ];

  const notifications = [
    { id: 1, title: 'Nouveau scénario disponible', message: 'Phishing avancé ajouté', time: 'Il y a 2h', read: false },
    { id: 2, title: 'Badge débloqué', message: 'Expert sécurité', time: 'Hier', read: true },
    { id: 3, title: 'Rappel hebdomadaire', message: 'Complétez votre formation', time: 'Il y a 3 jours', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Mobile Menu Button - visible uniquement sur mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg border border-gray-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Navigation */}
      <motion.nav
        initial={false}
        animate={{ 
          x: isMobile ? (isOpen ? 0 : -300) : 0
        }}
        className={`
          fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 z-40
          ${!isMobile ? 'md:fixed md:translate-x-0' : ''}
          transition-transform duration-300
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">SecuritySense</div>
                <div className="text-xs text-gray-500">Formation sécurité</div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-gray-900" />
              </div>
              
              <div>
                <div className="font-semibold">Employé</div>
                <div className="text-sm text-gray-400">Niveau {userProgress.level}</div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/20 to-emerald-600/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                      onClick={() => {
                        if (isMobile) setIsOpen(false);
                      }}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive ? 'bg-blue-500/20' : 'bg-gray-800'
                      }`}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Progress */}
          <div className="p-6 border-t border-gray-800">
            <div>
              <div className="text-sm text-gray-400 mb-2">Votre progression</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Niveau {userProgress.level}</span>
                <span className="text-sm text-emerald-400">
                  {userProgress.xp % 100}/100 XP
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                  style={{ width: `${(userProgress.xp % 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-800 space-y-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 w-full"
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-xs flex items-center justify-center">
                      {unreadCount}
                    </div>
                  )}
                </div>
                <span>Notifications</span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl z-50">
                  <div className="p-4 border-b border-gray-800">
                    <div className="font-semibold">Notifications</div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${
                          !notification.read ? 'bg-blue-500/5' : ''
                        }`}
                      >
                        <div className="font-medium mb-1">{notification.title}</div>
                        <div className="text-sm text-gray-400 mb-2">{notification.message}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <a
              href="/settings"
              className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <Settings className="w-5 h-5" />
              <span>Paramètres</span>
            </a>

            {/* Logout */}
            <button className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 w-full">
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Overlay - visible uniquement sur mobile quand le menu est ouvert */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}