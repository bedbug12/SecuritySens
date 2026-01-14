'use client';

import { useState, useCallback, useEffect } from 'react';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { useNotification } from '@/lib/contexts/NotificationContext';
import { calculateGameScore } from '@/lib/utils/scoring';

interface UseGameLogicOptions {
  totalQuestions: number;
  timeLimit?: number;
  onComplete?: (finalScore: number) => void;
}

export function useGameLogic({
  totalQuestions,
  timeLimit = 120,
  onComplete
}: UseGameLogicOptions) {
  const { completeGame } = useProgress();
  const { showNotification } = useNotification();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  /**
   * Démarrer le jeu
   */
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setTimeLeft(timeLimit);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setHintsUsed(0);
    setGameScore(0);
    setIsGameComplete(false);
    showNotification('Jeu démarré ! Bonne chance 🎮', 'info');
  }, [timeLimit, showNotification]);

  /**
   * Répondre à une question
   */
  const answerQuestion = useCallback((isCorrect: boolean) => {
    if (!isPlaying || isGameComplete) return;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Passer à la question suivante
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishGame();
    }
  }, [isPlaying, isGameComplete, currentQuestion, totalQuestions]);

  /**
   * Utiliser un indice
   */
  const useHint = useCallback(() => {
    if (hintsUsed >= 3) {
      showNotification('Vous avez utilisé tous vos indices', 'warning');
      return false;
    }
    
    setHintsUsed(prev => prev + 1);
    showNotification(`Indice utilisé (${hintsUsed + 1}/3)`, 'info');
    return true;
  }, [hintsUsed, showNotification]);

  /**
   * Passer une question
   */
  const skipQuestion = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      showNotification('Question passée', 'warning');
    } else {
      finishGame();
    }
  }, [currentQuestion, totalQuestions, showNotification]);

  /**
   * Terminer le jeu
   */
  const finishGame = useCallback(() => {
    if (isGameComplete) return;
    
    setIsPlaying(false);
    setIsGameComplete(true);
    
    // Calculer le score final
    const timeBonus = Math.floor(timeLeft / 6); // Bonus basé sur le temps restant
    const { score: finalScore } = calculateGameScore(
      correctAnswers,
      totalQuestions,
      timeBonus,
      hintsUsed
    );
    
    setGameScore(finalScore);
    
    // Enregistrer la progression
    completeGame(finalScore);
    
    // Notification
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    let notificationMessage = '';
    let notificationType: 'success' | 'warning' | 'info' = 'info';
    
    if (accuracy >= 80) {
      notificationMessage = `Excellent ! ${accuracy}% de précision`;
      notificationType = 'success';
    } else if (accuracy >= 60) {
      notificationMessage = `Bon travail ! ${accuracy}% de précision`;
      notificationType = 'info';
    } else {
      notificationMessage = `À améliorer. ${accuracy}% de précision`;
      notificationType = 'warning';
    }
    
    showNotification(
      notificationMessage,
      notificationType,
      `Score final: ${finalScore}`
    );
    
    // Callback parent
    if (onComplete) {
      onComplete(finalScore);
    }
  }, [isGameComplete, timeLeft, correctAnswers, totalQuestions, hintsUsed, completeGame, showNotification, onComplete]);

  /**
   * Formater le temps
   */
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Calculer la progression
   */
  const calculateProgress = useCallback(() => {
    return Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  }, [currentQuestion, totalQuestions]);

  /**
   * Obtenir le temps par question
   */
  const getTimePerQuestion = useCallback(() => {
    return Math.round(timeLimit / totalQuestions);
  }, [timeLimit, totalQuestions]);

  /**
   * Timer
   */
  useEffect(() => {
    if (!isPlaying || isGameComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, isGameComplete, finishGame]);

  return {
    // État
    isPlaying,
    timeLeft,
    currentQuestion,
    correctAnswers,
    hintsUsed,
    gameScore,
    isGameComplete,
    
    // Méthodes
    startGame,
    answerQuestion,
    useHint,
    skipQuestion,
    finishGame,
    formatTime,
    calculateProgress,
    getTimePerQuestion,
    
    // Utilitaires
    setIsPlaying,
    setTimeLeft
  };
}