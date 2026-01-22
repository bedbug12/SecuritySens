// lib/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  user: Session['user'] | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  updateUserProgress: (progress: Partial<Session['user']['progress']>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<Session['user'] | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const updateUserProgress = async (progress: Partial<Session['user']['progress']>) => {
    if (!user) return;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      });

      if (response.ok) {
        await update(); // Rafraîchir la session
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const refreshSession = async () => {
    await update();
  };

  return (
    <AuthContext.Provider value={{
      user,
      status,
      updateUserProgress,
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}