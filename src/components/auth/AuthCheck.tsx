// components/auth/AuthCheck.tsx
'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthCheckProps {
  children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = [
      '/auth/signin',
      '/auth/signup',
      '/auth/error',
      '/auth/verify',
      '/auth/reset-password',
      '/demo',
    ];

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (status === 'loading') return;

    // Si non connecté et sur une route privée, rediriger vers signin
    if (!session && !isPublicPath && pathname !== '/') {
      router.push('/auth/signin');
    }

    // Si connecté et sur une route d'auth, rediriger vers dashboard
    if (session && pathname.startsWith('/auth') && !pathname.includes('/auth/error')) {
      router.push('/dashboard');
    }

  }, [session, status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}