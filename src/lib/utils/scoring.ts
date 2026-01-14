import { UserProgress } from '../types';

/**
 * Calcule le nouveau score de vigilance
 */
export const calculateNewVigilanceScore = (
  currentScore: number, 
  newScore: number
): number => {
  // Moyenne mobile avec 70% d'historique, 30% de nouveau score
  return Math.round((currentScore * 0.7) + (newScore * 0.3));
};

/**
 * Calcule les points d'expérience gagnés
 */
export const calculateXPGained = (score: number): number => {
  if (score >= 90) return 15;
  if (score >= 80) return 12;
  if (score >= 70) return 10;
  if (score >= 60) return 8;
  if (score >= 50) return 5;
  return 2;
};

/**
 * Calcule le bonus de temps
 */
export const calculateTimeBonus = (timeLeft: number, maxTime: number): number => {
  const percentage = (timeLeft / maxTime) * 100;
  if (percentage >= 80) return 20;
  if (percentage >= 60) return 15;
  if (percentage >= 40) return 10;
  if (percentage >= 20) return 5;
  return 0;
};

/**
 * Vérifie si un badge doit être débloqué
 */
export const checkBadgeUnlocks = (
  progress: UserProgress,
  newScore: number
): string[] => {
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

/**
 * Évalue la performance
 */
export const evaluatePerformance = (score: number): {
  level: 'excellent' | 'good' | 'average' | 'needs_improvement';
  message: string;
  color: string;
} => {
  if (score >= 90) {
    return {
      level: 'excellent',
      message: 'Performance exceptionnelle !',
      color: 'emerald'
    };
  } else if (score >= 75) {
    return {
      level: 'good',
      message: 'Bonne performance !',
      color: 'blue'
    };
  } else if (score >= 60) {
    return {
      level: 'average',
      message: 'Performance moyenne',
      color: 'amber'
    };
  } else {
    return {
      level: 'needs_improvement',
      message: 'À améliorer',
      color: 'red'
    };
  }
};

/**
 * Calcule le niveau à partir de l'XP
 */
export const calculateLevel = (xp: number): {
  level: number;
  xpToNextLevel: number;
  progress: number;
} => {
  const baseXP = 100; // XP nécessaire pour chaque niveau
  const level = Math.floor(xp / baseXP) + 1;
  const xpForCurrentLevel = xp % baseXP;
  const xpToNextLevel = baseXP - xpForCurrentLevel;
  const progress = (xpForCurrentLevel / baseXP) * 100;

  return {
    level,
    xpToNextLevel,
    progress: Math.round(progress)
  };
};

/**
 * Formate le temps
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calcule le score d'un jeu
 */
export const calculateGameScore = (
  correctAnswers: number,
  totalQuestions: number,
  timeBonus: number,
  hintsUsed: number
): {
  score: number;
  percentage: number;
  breakdown: {
    correctPoints: number;
    timeBonus: number;
    hintPenalty: number;
  };
} => {
  const basePoints = 10;
  const hintPenalty = 5;
  
  const correctPoints = correctAnswers * basePoints;
  const hintPenaltyTotal = hintsUsed * hintPenalty;
  
  const rawScore = correctPoints + timeBonus - hintPenaltyTotal;
  const score = Math.max(0, rawScore);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return {
    score,
    percentage,
    breakdown: {
      correctPoints,
      timeBonus,
      hintPenalty: hintPenaltyTotal
    }
  };
};