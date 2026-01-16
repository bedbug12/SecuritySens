'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Timer,
  Target,
  Trophy,
  Star,
  HelpCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { games } from '@/lib/data/games';
import { TrueFalseGame } from '@/components/games/TrueFalseGame';
import { SpotTheSigns } from '@/components/games/SpotTheSigns';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { useNotification } from '@/components/feedback/NotificationProvider';
import { CyberButton } from '@/components/ui/CyberButton';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { userProgress } = useProgress();
  const { showNotification } = useNotification();
  
  const [game, setGame] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(520); // 3 minutes
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const found = games.find(g => g.id === params.slug);
    if (found) {
      setGame(found);
    } else {
      router.push('/games');
    }
  }, [params.slug, router]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleGameComplete();
    }
  }, [isPlaying, timeLeft, showResults]);

  const handleStartGame = () => {
    setIsPlaying(true);
    showNotification('Jeu démarré ! Bonne chance 🎮', 'info');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 10);
      showNotification('Bonne réponse ! +10 points', 'success');
    } else {
      showNotification('Réponse incorrecte', 'warning');
    }
  };

  const handleGameComplete = () => {
    setIsPlaying(false);
    setShowResults(true);
    
    const finalScore = score + Math.floor(timeLeft / 3); // Bonus temps
    showNotification(`Score final: ${finalScore} points`, 'info');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement du jeu...</p>
        </div>
      </div>
    );
  }

  const renderGame = () => {
    switch(game.id) {
      case 'true-false':
        return <TrueFalseGame onAnswer={handleAnswer} />;
      case 'spot-signs':
        return <SpotTheSigns onAnswer={handleAnswer} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Ce jeu sera bientôt disponible</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/games')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux jeux
          </button>
          
          {isPlaying && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 rounded-lg border border-gray-800">
                <Timer className="w-5 h-5 text-blue-400" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 rounded-lg border border-gray-800">
                <Target className="w-5 h-5 text-emerald-400" />
                <span className="text-lg font-bold">{score}</span>
                <span className="text-gray-400 text-sm">pts</span>
              </div>
            </div>
          )}
        </div>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full border border-blue-700/50 mb-6">
            <Trophy className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Jeu d'entraînement</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {game.title}
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {game.description}
          </p>
        </motion.div>

        {/* Instructions */}
        {!isPlaying && !showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                  <HelpCircle className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Comment jouer ?</h2>
                  <p className="text-gray-400">Règles du jeu et objectifs</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Répondez rapidement</div>
                    <p className="text-gray-400 text-sm">
                      Vous avez 3 minutes pour répondre à un maximum de questions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Gagnez des points</div>
                    <p className="text-gray-400 text-sm">
                      Chaque bonne réponse rapporte 10 points. Un bonus temps est accordé
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Améliorez votre score</div>
                    <p className="text-gray-400 text-sm">
                      Votre score contribue à votre niveau de vigilance global
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {game.questions}
                  </div>
                  <div className="text-sm text-gray-400">Questions</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">
                    {game.duration} min
                  </div>
                  <div className="text-sm text-gray-400">Durée</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {game.avgScore}%
                  </div>
                  <div className="text-sm text-gray-400">Score moyen</div>
                </div>
              </div>
              
              <CyberButton
                variant="primary"
                onClick={handleStartGame}
                className="w-full py-4 text-lg"
              >
                🎮 Commencer le jeu
              </CyberButton>
            </div>
          </motion.div>
        )}

        {/* Jeu en cours */}
        {isPlaying && !showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
              {renderGame()}
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <CyberButton
                  variant="outline"
                  onClick={handleGameComplete}
                  className="w-full"
                >
                  Terminer le jeu
                </CyberButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Résultats */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                </div>
                
                <h2 className="text-3xl font-bold mb-4">Jeu terminé !</h2>
                <p className="text-gray-400 mb-8">
                  {score >= 80 ? 'Excellent score !' :
                   score >= 60 ? 'Bon travail !' :
                   'Continuez à vous entraîner !'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {score}
                  </div>
                  <div className="text-gray-400">Score</div>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">
                    {Math.floor(timeLeft / 3)}
                  </div>
                  <div className="text-gray-400">Bonus temps</div>
                </div>
              </div>

              {/* Score final */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 mb-8 border border-blue-700/30">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">SCORE FINAL</div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {score + Math.floor(timeLeft / 3)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <CyberButton
                  variant="outline"
                  onClick={() => {
                    setIsPlaying(true);
                    setScore(0);
                    setTimeLeft(180);
                    setShowResults(false);
                  }}
                  className="flex-1"
                >
                  Rejouer
                </CyberButton>
                
                <CyberButton
                  variant="primary"
                  onClick={() => router.push('/games')}
                  className="flex-1"
                >
                  Autres jeux
                </CyberButton>
                
                <CyberButton
                  variant="ghost"
                  onClick={() => router.push('/progress')}
                  className="flex-1"
                >
                  Voir ma progression
                </CyberButton>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}