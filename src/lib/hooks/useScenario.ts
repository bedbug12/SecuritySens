'use client';

import { useState, useCallback } from 'react';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { useNotification } from '@/lib/contexts/NotificationContext';
import { calculateXPGained, calculateTimeBonus } from '@/lib/utils/scoring';

interface UseScenarioOptions {
  scenarioId: string;
  maxTime?: number;
  onComplete?: (score: number, timeSpent: number) => void;
}

export function useScenario({
  scenarioId,
  maxTime = 60,
  onComplete
}: UseScenarioOptions) {
  const { completeScenario } = useProgress();
  const { showNotification } = useNotification();
  
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [score, setScore] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [userAction, setUserAction] = useState<string | null>(null);

  /**
   * Démarrer le scénario
   */
  const startScenario = useCallback(() => {
    setIsActive(true);
    setTimeLeft(maxTime);
    setScore(null);
    setIsComplete(false);
    setUserAction(null);
    showNotification('Scénario démarré !', 'info');
  }, [maxTime, showNotification]);

  /**
   * Réinitialiser le scénario
   */
  const resetScenario = useCallback(() => {
    setIsActive(false);
    setTimeLeft(maxTime);
    setScore(null);
    setIsComplete(false);
    setUserAction(null);
  }, [maxTime]);

  /**
   * Gérer une action utilisateur
   */
  const handleUserAction = useCallback((action: string, isCorrect: boolean) => {
    if (!isActive || isComplete) return;
    
    setUserAction(action);
    
    // Calculer le score
    let calculatedScore = isCorrect ? 100 : 50;
    
    // Ajouter le bonus temps
    const timeBonus = calculateTimeBonus(timeLeft, maxTime);
    calculatedScore += timeBonus;
    
    setScore(calculatedScore);
    setIsComplete(true);
    setIsActive(false);
    
    // Enregistrer la progression
    completeScenario(scenarioId, calculatedScore);
    
    // XP gagné
    const xpGained = calculateXPGained(calculatedScore);
    
    // Notification
    if (isCorrect) {
      showNotification(
        `Excellent ! +${xpGained} XP`,
        'success',
        `Score: ${calculatedScore}/100`
      );
    } else {
      showNotification(
        `À améliorer. +${xpGained} XP`,
        'warning',
        `Score: ${calculatedScore}/100`
      );
    }
    
    // Callback parent
    if (onComplete) {
      onComplete(calculatedScore, maxTime - timeLeft);
    }
  }, [isActive, isComplete, timeLeft, maxTime, scenarioId, completeScenario, showNotification, onComplete]);

  /**
   * Formater le temps
   */
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Évaluer la performance
   */
  const evaluatePerformance = useCallback((scoreValue: number) => {
    if (scoreValue >= 90) return 'excellent';
    if (scoreValue >= 75) return 'bon';
    if (scoreValue >= 60) return 'moyen';
    return 'à améliorer';
  }, []);

  /**
   * Obtenir la couleur du score
   */
  const getScoreColor = useCallback((scoreValue: number) => {
    if (scoreValue >= 90) return 'text-emerald-400';
    if (scoreValue >= 75) return 'text-blue-400';
    if (scoreValue >= 60) return 'text-amber-400';
    return 'text-red-400';
  }, []);

  return {
    // État
    isActive,
    timeLeft,
    score,
    isComplete,
    userAction,
    
    // Méthodes
    startScenario,
    resetScenario,
    handleUserAction,
    formatTime,
    evaluatePerformance,
    getScoreColor,
    
    // Utilitaires
    setIsActive,
    setTimeLeft
  };
}