'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Timer,
  ZoomIn,
  HelpCircle
} from 'lucide-react';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { gameScenarios } from '@/lib/data/games';

interface SpotTheSignsProps {
  onAnswer: (isCorrect: boolean) => void;
}

export function SpotTheSigns({ onAnswer }: SpotTheSignsProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameComplete, setGameComplete] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const currentScenario = gameScenarios[currentScenarioIndex];

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameComplete) {
      handleSubmit();
    }
  }, [timeLeft, gameComplete]);

  const toggleSign = (signId: string) => {
    if (selectedSigns.includes(signId)) {
      setSelectedSigns(selectedSigns.filter(id => id !== signId));
    } else if (selectedSigns.length < currentScenario.correctSigns.length) {
      setSelectedSigns([...selectedSigns, signId]);
    }
  };

  const handleSubmit = () => {
    if (selectedSigns.length === 0) return;
    
    // Calcul du score
    const correctSelections = selectedSigns.filter(sign => 
      currentScenario.correctSigns.includes(sign)
    ).length;
    
    const incorrectSelections = selectedSigns.length - correctSelections;
    const missedSigns = currentScenario.correctSigns.length - correctSelections;
    
    let calculatedScore = 0;
    
    // Points pour les bonnes réponses
    calculatedScore += correctSelections * 15;
    
    // Pénalités pour les mauvaises réponses
    calculatedScore -= incorrectSelections * 5;
    
    // Pénalités pour les signes manqués
    calculatedScore -= missedSigns * 10;
    
    // Bonus temps
    const timeBonus = Math.floor(timeLeft / 3);
    calculatedScore += timeBonus;
    
    // Bonus pour le hint non utilisé
    if (!hintUsed) {
      calculatedScore += 10;
    }
    
    calculatedScore = Math.max(0, calculatedScore);
    
    setScore(prev => prev + calculatedScore);
    onAnswer(calculatedScore > 0);
    
    // Passer au scénario suivant ou terminer
    if (currentScenarioIndex < gameScenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenarioIndex(prev => prev + 1);
        setSelectedSigns([]);
        setTimeLeft(60);
        setHintUsed(false);
      }, 2000);
    } else {
      setGameComplete(true);
    }
  };

  const useHint = () => {
    if (hintUsed) return;
    
    // Révéler un signe aléatoire correct
    const unrevealedSigns = currentScenario.correctSigns.filter(
      sign => !selectedSigns.includes(sign)
    );
    
    if (unrevealedSigns.length > 0) {
      const randomSign = unrevealedSigns[Math.floor(Math.random() * unrevealedSigns.length)];
      setSelectedSigns([...selectedSigns, randomSign]);
      setHintUsed(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSignStatus = (signId: string) => {
    if (selectedSigns.includes(signId)) {
      return currentScenario.correctSigns.includes(signId) ? 'correct' : 'incorrect';
    }
    return 'unselected';
  };

  if (gameComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Jeu terminé !
        </div>
        <p className="text-xl text-gray-400 mb-8">
          Score final : {score} points
        </p>
        <AlertBadge 
          type={score > 200 ? 'success' : score > 100 ? 'warning' : 'error'}
          message={score > 200 ? 'Excellent travail !' : score > 100 ? 'Bon travail !' : 'À améliorer'}
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Repérez les signaux</h2>
          <p className="text-gray-400">Identifiez les indices d'une attaque de social engineering</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-gray-400">points</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
            <Timer className="w-5 h-5 text-blue-400" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-900/50 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Scénario {currentScenarioIndex + 1}/{gameScenarios.length}</span>
          <span>{currentScenario.correctSigns.length} signaux à trouver</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentScenarioIndex + 1) / gameScenarios.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Scenario Card */}
      <motion.div
        key={currentScenarioIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
      >
        {/* Scenario Description */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-400/10">
              <Search className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-lg font-medium text-gray-400">Scénario</div>
              <h3 className="text-xl font-bold">{currentScenario.title}</h3>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <p className="text-gray-300">{currentScenario.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AlertBadge 
              type="info" 
              message={`Type: ${currentScenario.type}`}
              size="sm"
            />
            <AlertBadge 
              type="warning" 
              message={`Difficulté: ${currentScenario.difficulty}`}
              size="sm"
            />
          </div>
        </div>

        {/* Signs Grid */}
        <div className="mb-8">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Quels sont les signaux d'alerte ?
            <span className="text-sm text-gray-400 ml-2">
              ({selectedSigns.length}/{currentScenario.correctSigns.length} sélectionnés)
            </span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentScenario.allSigns.map((sign, index) => {
              const status = getSignStatus(sign.id);
              
              return (
                <motion.button
                  key={sign.id}
                  whileHover={{ scale: status === 'unselected' ? 1.02 : 1 }}
                  whileTap={{ scale: status === 'unselected' ? 0.98 : 1 }}
                  onClick={() => toggleSign(sign.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    status === 'correct' 
                      ? 'bg-emerald-400/10 border-emerald-400'
                      : status === 'incorrect'
                      ? 'bg-red-400/10 border-red-400'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      status === 'correct'
                        ? 'bg-emerald-400/20 text-emerald-400'
                        : status === 'incorrect'
                        ? 'bg-red-400/20 text-red-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {status === 'correct' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : status === 'incorrect' ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">{sign.text}</div>
                      {sign.description && (
                        <div className="text-sm text-gray-400">{sign.description}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={useHint}
            disabled={hintUsed || selectedSigns.length >= currentScenario.correctSigns.length}
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
              hintUsed
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            {hintUsed ? 'Indice utilisé' : 'Utiliser un indice (-10 pts)'}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={selectedSigns.length === 0}
            className={`flex-1 px-6 py-3 rounded-lg font-medium ${
              selectedSigns.length === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90 text-white'
            }`}
          >
            Valider la sélection
          </button>
          
          <button
            onClick={() => setSelectedSigns([])}
            className="px-6 py-3 rounded-lg font-medium border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Réinitialiser
          </button>
        </div>

        {/* Hint */}
        {hintUsed && (
          <div className="mt-6 p-4 bg-blue-400/10 rounded-xl border border-blue-400/30">
            <div className="flex items-center gap-2 mb-2">
              <ZoomIn className="w-5 h-5 text-blue-400" />
              <div className="font-medium text-blue-400">Indice utilisé</div>
            </div>
            <p className="text-sm text-gray-300">
              Un signal d'alerte a été sélectionné pour vous. Vous perdrez 10 points sur votre bonus final.
            </p>
          </div>
        )}
      </motion.div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
        <h4 className="text-lg font-bold mb-4">📋 Instructions</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="font-medium">Sélectionnez les signaux d'alerte</div>
              <p className="text-sm text-gray-400">
                Cliquez sur les éléments qui vous semblent suspects dans le scénario
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <div>
              <div className="font-medium">Utilisez les indices avec parcimonie</div>
              <p className="text-sm text-gray-400">
                Chaque indice utilisé réduira votre bonus final de 10 points
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div>
              <div className="font-medium">Attention aux mauvaises réponses</div>
              <p className="text-sm text-gray-400">
                Les sélections incorrectes vous feront perdre des points
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}