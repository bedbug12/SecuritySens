// lib/contexts/ProgressContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Types
interface UserProgress {
  id?: string;
  level: number;
  xp: number;
  vigilanceScore: number;
  completedScenarios: string[];
  badges: string[];
  gamesPlayed: number;
  consecutiveCorrect: number;
  lastPlayed: Date | null;
  userId?: string;
}

interface ProgressContextType {
  userProgress: UserProgress;
  completeScenario: (scenarioId: string, score: number, timeSpent?: number) => Promise<void>;
  completeGame: (score: number) => Promise<void>;
  addBadge: (badgeId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  updateVigilanceScore: (newScore: number) => Promise<void>;
  getProgressPercentage: () => number;
  getLevelProgress: () => { level: number; progress: number; xpToNext: number };
  isLoading: boolean;
}

// Valeur par défaut
const defaultProgress: UserProgress = {
  level: 1,
  xp: 0,
  vigilanceScore: 50,
  completedScenarios: [],
  badges: ['starter'],
  gamesPlayed: 0,
  consecutiveCorrect: 0,
  lastPlayed: null
};

// Création du contexte
export const ProgressContext = createContext<ProgressContextType>({
  userProgress: defaultProgress,
  completeScenario: async () => {},
  completeGame: async () => {},
  addBadge: async () => {},
  resetProgress: async () => {},
  updateVigilanceScore: async () => {},
  getProgressPercentage: () => 0,
  getLevelProgress: () => ({ level: 1, progress: 0, xpToNext: 100 }),
  isLoading: true
});

// Props pour le provider
interface ProgressProviderProps {
  children: ReactNode;
}

// Provider principal
export function ProgressProvider({ children }: ProgressProviderProps) {
  const { data: session, status } = useSession();
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la progression depuis l'API
  useEffect(() => {
    const loadUserProgress = async () => {
      setIsLoading(true);
      
      if (status === 'authenticated' && session?.user?.id) {
        try {
          // Charger depuis l'API
          const response = await fetch('/api/user/progress');
          if (response.ok) {
            const data = await response.json();
            setUserProgress(data);
          } else {
            // Créer une progression si elle n'existe pas
            await initializeUserProgress();
          }
        } catch (error) {
          console.error('Error loading progress:', error);
          // Fallback sur localStorage pour les tests
          loadFromLocalStorage();
        }
      } else if (status === 'unauthenticated') {
        // Mode invité - utiliser localStorage
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    };

    loadUserProgress();
  }, [session, status]);

  // Charger depuis localStorage (mode invité)
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('security-sense-progress-guest');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastPlayed && typeof parsed.lastPlayed === 'string') {
          parsed.lastPlayed = new Date(parsed.lastPlayed);
        }
        setUserProgress(parsed);
      }
    } catch (error) {
      console.error('Error loading guest progress:', error);
    }
  };

  // Initialiser la progression utilisateur
  const initializeUserProgress = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultProgress),
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data);
      }
    } catch (error) {
      console.error('Error initializing progress:', error);
    }
  };

  // Sauvegarder la progression
  const saveProgress = async (progress: UserProgress) => {
    if (session?.user?.id) {
      // Sauvegarder sur l'API
      try {
        await fetch('/api/user/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress),
        });
      } catch (error) {
        console.error('Error saving progress to API:', error);
      }
    } else {
      // Mode invité - sauvegarder dans localStorage
      localStorage.setItem('security-sense-progress-guest', JSON.stringify(progress));
    }
  };

  // Calculer le nouveau score de vigilance
  const calculateNewVigilanceScore = (currentScore: number, newScore: number): number => {
    return Math.round((currentScore * 0.7) + (newScore * 0.3));
  };

  // Vérifier les badges à débloquer
  const checkBadgeUnlocks = (progress: UserProgress, newScore: number): string[] => {
    const newBadges: string[] = [];
    const { completedScenarios, consecutiveCorrect, vigilanceScore } = progress;

    // Badges basés sur les scénarios
    if (completedScenarios.length >= 3 && !progress.badges.includes('learner')) {
      newBadges.push('learner');
    }
    if (completedScenarios.length >= 5 && !progress.badges.includes('scenario-master')) {
      newBadges.push('scenario-master');
    }
    if (completedScenarios.length >= 10 && !progress.badges.includes('scenario-expert')) {
      newBadges.push('scenario-expert');
    }

    // Badges basés sur la consistance
    if (consecutiveCorrect >= 3 && !progress.badges.includes('consistent')) {
      newBadges.push('consistent');
    }
    if (consecutiveCorrect >= 5 && !progress.badges.includes('perfect-streak')) {
      newBadges.push('perfect-streak');
    }

    // Badges basés sur le score
    if (vigilanceScore >= 80 && !progress.badges.includes('vigilant')) {
      newBadges.push('vigilant');
    }
    if (vigilanceScore >= 90 && !progress.badges.includes('security-expert')) {
      newBadges.push('security-expert');
    }
    if (vigilanceScore >= 95 && !progress.badges.includes('cyber-master')) {
      newBadges.push('cyber-master');
    }

    // Badge spécial pour score parfait
    if (newScore === 100 && !progress.badges.includes('perfect-score')) {
      newBadges.push('perfect-score');
    }

    return newBadges;
  };

  // Compléter un scénario
  const completeScenario = async (scenarioId: string, score: number, timeSpent?: number) => {
    const newProgress = { ...userProgress };
    
    // Mettre à jour la progression locale
    newProgress.completedScenarios = [...new Set([...newProgress.completedScenarios, scenarioId])];
    newProgress.vigilanceScore = Math.min(100, Math.max(0, 
      calculateNewVigilanceScore(newProgress.vigilanceScore, score)
    ));
    newProgress.consecutiveCorrect = score >= 80 ? newProgress.consecutiveCorrect + 1 : 0;
    newProgress.xp += Math.round(score / 10);
    newProgress.level = Math.floor(newProgress.xp / 100) + 1;
    newProgress.lastPlayed = new Date();

    // Vérifier les badges
    const unlockedBadges = checkBadgeUnlocks(newProgress, score);
    newProgress.badges = [...new Set([...newProgress.badges, ...unlockedBadges])];

    // Sauvegarder le score du scénario
    if (session?.user?.id) {
      try {
        await fetch('/api/user/scenario-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId,
            score,
            timeSpent: timeSpent || 0
          }),
        });
      } catch (error) {
        console.error('Error saving scenario score:', error);
      }
    }

    // Mettre à jour l'état local
    setUserProgress(newProgress);
    
    // Sauvegarder la progression
    await saveProgress(newProgress);
  };

  // Compléter un jeu
  const completeGame = async (score: number) => {
    const newProgress = {
      ...userProgress,
      gamesPlayed: userProgress.gamesPlayed + 1,
      xp: userProgress.xp + Math.round(score / 20),
      lastPlayed: new Date()
    };

    setUserProgress(newProgress);
    await saveProgress(newProgress);
  };

  // Ajouter un badge manuellement
  const addBadge = async (badgeId: string) => {
    if (userProgress.badges.includes(badgeId)) return;

    const newProgress = {
      ...userProgress,
      badges: [...userProgress.badges, badgeId]
    };

    setUserProgress(newProgress);
    await saveProgress(newProgress);
  };

  // Réinitialiser la progression
  const resetProgress = async () => {
    const confirmReset = window.confirm('Êtes-vous sûr de vouloir réinitialiser votre progression ?');
    if (!confirmReset) return;

    const resetProgress = { ...defaultProgress };
    
    if (session?.user?.id) {
      try {
        await fetch('/api/user/reset-progress', { method: 'POST' });
      } catch (error) {
        console.error('Error resetting progress:', error);
      }
    } else {
      localStorage.removeItem('security-sense-progress-guest');
    }

    setUserProgress(resetProgress);
  };

  // Mettre à jour le score de vigilance
  const updateVigilanceScore = async (newScore: number) => {
    const newProgress = {
      ...userProgress,
      vigilanceScore: Math.min(100, Math.max(0, newScore))
    };

    setUserProgress(newProgress);
    await saveProgress(newProgress);
  };

  // Obtenir le pourcentage de progression global
  const getProgressPercentage = (): number => {
    const maxPossible = 100;
    return Math.round((userProgress.vigilanceScore / maxPossible) * 100);
  };

  // Obtenir la progression du niveau
  const getLevelProgress = () => {
    const baseXP = 100;
    const level = Math.floor(userProgress.xp / baseXP) + 1;
    const xpForCurrentLevel = userProgress.xp % baseXP;
    const progress = (xpForCurrentLevel / baseXP) * 100;
    const xpToNext = baseXP - xpForCurrentLevel;

    return {
      level,
      progress: Math.round(progress),
      xpToNext
    };
  };

  // Valeur du contexte
  const contextValue: ProgressContextType = {
    userProgress,
    completeScenario,
    completeGame,
    addBadge,
    resetProgress,
    updateVigilanceScore,
    getProgressPercentage,
    getLevelProgress,
    isLoading
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useProgressContext() {
  const context = useContext(ProgressContext);
  
  if (!context) {
    throw new Error('useProgressContext must be used within ProgressProvider');
  }
  
  return context;
}

// Hook simplifié avec alias
export const useProgress = useProgressContext;