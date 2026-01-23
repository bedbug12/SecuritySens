// app/layout.tsx
'use client'; // Doit être en première ligne

import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { ProgressProvider } from '@/lib/contexts/ProgressContext';
import { NotificationProvider } from '@/components/feedback/NotificationProvider';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains'
});

// Pages où la navigation doit être cachée
const HIDE_NAVIGATION_PATHS = [
  '/',                    // Page d'accueil
   "/auth/signin",
      "/auth/signup",
      "/auth/error",
      "/auth/verify",
      "/auth/reset-password",
      "/api/auth",
      "/api/auth/callback",
      "/landingpage",
];

// Fonction pour vérifier si la navigation doit être masquée
function shouldHideNavigation(pathname: string) {
  return HIDE_NAVIGATION_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavigation = shouldHideNavigation(pathname);

  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-gray-950 text-gray-100">
        <SessionProvider>
          <ProgressProvider>
            <NotificationProvider>
              <div className="flex min-h-screen">
                {/* Navigation conditionnelle */}
                {!hideNavigation && <Navigation />}
                <main className={`flex-1 ${!hideNavigation ? 'md:ml-64' : ''} overflow-y-auto`}>
                  {children}
                </main>
              </div>
            </NotificationProvider>
          </ProgressProvider>
        </SessionProvider>
      </body>
    </html>
  );
}