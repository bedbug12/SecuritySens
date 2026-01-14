// lib/contexts/ProgressContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface UserProgress {
  level: number;
  xp: number;
  vigilanceScore: number;
  completedScenarios: string[];
  badges: string[];
  gamesPlayed: number;
  consecutiveCorrect: number;
  lastPlayed: Date | null;
}

interface ProgressContextType {
  userProgress: UserProgress;
  completeScenario: (scenarioId: string, score: number) => void;
  completeGame: (score: number) => void;
  addBadge: (badgeId: string) => void;
  resetProgress: () => void;
  updateVigilanceScore: (newScore: number) => void;
  getProgressPercentage: () => number;
  getLevelProgress: () => { level: number; progress: number; xpToNext: number };
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
  completeScenario: () => {},
  completeGame: () => {},
  addBadge: () => {},
  resetProgress: () => {},
  updateVigilanceScore: () => {},
  getProgressPercentage: () => 0,
  getLevelProgress: () => ({ level: 1, progress: 0, xpToNext: 100 })
});

// Props pour le provider
interface ProgressProviderProps {
  children: ReactNode;
}

// Provider principal
export function ProgressProvider({ children }: ProgressProviderProps) {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    // Charger depuis localStorage si disponible
    if (typeof window === 'undefined') return defaultProgress;
    
    try {
      const saved = localStorage.getItem('security-sense-progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convertir la date string en Date object
        if (parsed.lastPlayed && typeof parsed.lastPlayed === 'string') {
          parsed.lastPlayed = new Date(parsed.lastPlayed);
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    }
    
    return defaultProgress;
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('security-sense-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Calculer le nouveau score de vigilance (moyenne mobile)
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
  const completeScenario = (scenarioId: string, score: number) => {
    setUserProgress(prev => {
      const newCompleted = [...prev.completedScenarios, scenarioId];
      const newVigilanceScore = calculateNewVigilanceScore(prev.vigilanceScore, score);
      const newConsecutive = score >= 80 ? prev.consecutiveCorrect + 1 : 0;
      const xpGained = Math.round(score / 10);
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 100) + 1;

      // Vérifier les nouveaux badges
      const unlockedBadges = checkBadgeUnlocks(
        {
          ...prev,
          completedScenarios: newCompleted,
          consecutiveCorrect: newConsecutive,
          vigilanceScore: newVigilanceScore
        },
        score
      );

      const newBadges = [...prev.badges, ...unlockedBadges.filter(b => !prev.badges.includes(b))];

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        vigilanceScore: Math.min(100, Math.max(0, newVigilanceScore)),
        completedScenarios: newCompleted,
        badges: newBadges,
        consecutiveCorrect: newConsecutive,
        lastPlayed: new Date()
      };
    });
  };

  // Compléter un jeu
  const completeGame = (score: number) => {
    setUserProgress(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      xp: prev.xp + Math.round(score / 20),
      lastPlayed: new Date()
    }));
  };

  // Ajouter un badge manuellement
  const addBadge = (badgeId: string) => {
    setUserProgress(prev => ({
      ...prev,
      badges: prev.badges.includes(badgeId) ? prev.badges : [...prev.badges, badgeId]
    }));
  };

  // Réinitialiser la progression
  const resetProgress = () => {
    setUserProgress(defaultProgress);
  };

  // Mettre à jour le score de vigilance
  const updateVigilanceScore = (newScore: number) => {
    setUserProgress(prev => ({
      ...prev,
      vigilanceScore: Math.min(100, Math.max(0, newScore))
    }));
  };

  // Obtenir le pourcentage de progression global
  const getProgressPercentage = (): number => {
    const maxPossible = 100; // Score max de vigilance
    return Math.round((userProgress.vigilanceScore / maxPossible) * 100);
  };

  // Obtenir la progression du niveau
  const getLevelProgress = () => {
    const baseXP = 100; // XP nécessaire par niveau
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
    getLevelProgress
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