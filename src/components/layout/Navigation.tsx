// components/layout/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home,
  Target,
  Gamepad2,
  Trophy,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  LogIn,
  UserPlus,
  BookOpen,
  Users,
  BarChart3,
  Award,
  ChevronRight
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { CyberButton } from '@/components/ui/CyberButton';
import { useProgress } from '@/lib/contexts/ProgressContext';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { userProgress } = useProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Ne pas afficher la navigation sur certaines pages
  const hideOnPaths = ['/auth/signin', '/auth/signup', '/auth/error'];
  const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));
  
  // Sur la page d'accueil publique, ne pas afficher la sidebar complète
  const isPublicHome = pathname === '/' && status !== 'authenticated';

  const navItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: <Home className="w-5 h-5" /> },
    { path: '/scenarios', label: 'Scénarios', icon: <Target className="w-5 h-5" /> },
    { path: '/games', label: 'Jeux', icon: <Gamepad2 className="w-5 h-5" /> },
    { path: '/progress', label: 'Progression', icon: <Trophy className="w-5 h-5" /> },
    { path: '/profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (!mounted || shouldHide) {
    return null;
  }

  // Version mobile - toujours afficher un bouton menu
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 border border-gray-800"
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );

  // Pour la page d'accueil publique (non connecté), afficher une navbar simple
  if (isPublicHome) {
    return (
      <>
        <MobileMenuButton />
        
        {/* Navbar simple pour landing page */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 md:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-700/30">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-bold text-sm">SecuritySense</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="px-3 py-1.5 text-xs bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Pour les utilisateurs connectés et autres pages
  return (
    <>
      <MobileMenuButton />
      
      {/* Sidebar principale - fixe et scroll indépendant */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-950 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out z-40 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:flex-shrink-0
        overflow-y-auto  // Permet le scroll dans la sidebar si nécessaire
        scrollbar-hide
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link 
              href={status === 'authenticated' ? '/dashboard' : '/'} 
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-700/30">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                SecuritySense
              </span>
            </Link>
          </div>

          {/* Contenu selon état de connexion */}
          {status === 'authenticated' ? (
            <>
              {/* User info */}
              <div className="p-6 border-b border-gray-800">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                      <span className="font-bold text-white">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold truncate">{session?.user?.name || 'Utilisateur'}</div>
                      <div className="text-sm text-gray-400 truncate">{session?.user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-900/50 rounded-lg">
                      <div className="text-xs text-gray-400">Niveau</div>
                      <div className="text-emerald-400 font-bold">{userProgress?.level || 1}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-900/50 rounded-lg">
                      <div className="text-xs text-gray-400">Vigilance</div>
                      <div className="text-blue-400 font-bold">{userProgress?.vigilanceScore || 50}/100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${pathname === item.path || pathname.startsWith(`${item.path}/`)
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                      `}
                    >
                      {item.icon}
                      {item.label}
                      {pathname === item.path && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Bottom section */}
              <div className="p-4 border-t border-gray-800 space-y-2 mt-auto">
                <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 w-full">
                  <Settings className="w-5 h-5" />
                  Paramètres
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Pour les pages publiques (sauf landing) */}
              <div className="p-6 border-b border-gray-800">
                <p className="text-gray-400 text-sm mb-4">
                  Connectez-vous pour accéder à toutes les fonctionnalités
                </p>
                <div className="space-y-3">
                  <CyberButton
                    variant="primary"
                    onClick={() => router.push('/auth/signin')}
                    icon={<LogIn className="w-5 h-5" />}
                    className="w-full"
                  >
                    Se connecter
                  </CyberButton>
                  <CyberButton
                    variant="outline"
                    onClick={() => router.push('/auth/signup')}
                    icon={<UserPlus className="w-5 h-5" />}
                    className="w-full"
                  >
                    S'inscrire
                  </CyberButton>
                </div>
              </div>

              {/* Navigation publique */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  <Link
                    href="/"
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${pathname === '/'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <Home className="w-5 h-5" />
                    Accueil
                  </Link>
                  <Link
                    href="/demo"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"
                  >
                    <BookOpen className="w-5 h-5" />
                    Démo
                  </Link>
                </div>
              </nav>

              {/* Stats globales */}
              <div className="p-4 border-t border-gray-800 mt-auto">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">
                  🌟 Notre impact
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-400 flex-1">Experts formés</span>
                    <span className="font-semibold">1,247+</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400 flex-1">Taux de réussite</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400 flex-1">Attaques prévenues</span>
                    <span className="font-semibold">8,942+</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}