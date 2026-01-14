'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Timer,
  Target,
  AlertTriangle
} from 'lucide-react';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { quizQuestions } from '@/lib/data/quizQuestions';

interface TrueFalseGameProps {
  onAnswer: (isCorrect: boolean) => void;
}

export function TrueFalseGame({ onAnswer }: TrueFalseGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStats, setGameStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0
  });

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAnswer) {
      handleSkip();
    }
  }, [timeLeft, selectedAnswer]);

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer) return;
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    setSelectedAnswer(answer ? 'true' : 'false');
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2);
      const newScore = score + 10 + timeBonus;
      setScore(newScore);
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setGameStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    
    onAnswer(isCorrect);
    setShowFeedback(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleSkip = () => {
    if (selectedAnswer) return;
    
    setSelectedAnswer('skip');
    setGameStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    setShowFeedback(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(10);
      setShowFeedback(false);
    } else {
      // Fin du jeu
      // Vous pouvez déclencher une fin de jeu ici
    }
  };

  const getAnswerColor = (answerType: string) => {
    if (!selectedAnswer) return '';
    
    if (answerType === 'true') {
      return currentQuestion.correctAnswer ? 'bg-emerald-400/20 border-emerald-400' : 'bg-red-400/20 border-red-400';
    } else {
      return !currentQuestion.correctAnswer ? 'bg-emerald-400/20 border-emerald-400' : 'bg-red-400/20 border-red-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Vrai ou Faux ?</h2>
          <p className="text-gray-400">Testez vos connaissances sur le social engineering</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-gray-400">points</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
            <Timer className="w-5 h-5 text-blue-400" />
            <span className="font-mono text-lg">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-900/50 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentQuestionIndex + 1}/{quizQuestions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
      >
        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-400/10">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-lg font-medium text-gray-400">Affirmation</div>
          </div>
          
          <h3 className="text-2xl font-bold text-center mb-6">
            "{currentQuestion.question}"
          </h3>
          
          <div className="flex justify-center">
            <AlertBadge 
              type={currentQuestion.difficulty === 'easy' ? 'success' : 
                    currentQuestion.difficulty === 'medium' ? 'warning' : 'error'}
              message={`Difficulté: ${currentQuestion.difficulty === 'easy' ? 'Facile' :
                       currentQuestion.difficulty === 'medium' ? 'Moyenne' : 'Difficile'}`}
            />
          </div>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
            whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
            onClick={() => handleAnswer(true)}
            disabled={!!selectedAnswer}
            className={`p-8 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
              selectedAnswer === 'true' 
                ? getAnswerColor('true')
                : 'border-gray-700 hover:border-emerald-500 bg-gray-800/50 hover:bg-gray-800'
            } ${selectedAnswer ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <CheckCircle className={`w-12 h-12 mb-4 ${
              selectedAnswer === 'true'
                ? currentQuestion.correctAnswer ? 'text-emerald-400' : 'text-red-400'
                : 'text-gray-400'
            }`} />
            <span className="text-2xl font-bold">VRAI</span>
            <span className="text-sm text-gray-400 mt-2">Cette affirmation est correcte</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
            whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
            onClick={() => handleAnswer(false)}
            disabled={!!selectedAnswer}
            className={`p-8 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
              selectedAnswer === 'false' 
                ? getAnswerColor('false')
                : 'border-gray-700 hover:border-red-500 bg-gray-800/50 hover:bg-gray-800'
            } ${selectedAnswer ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <XCircle className={`w-12 h-12 mb-4 ${
              selectedAnswer === 'false'
                ? !currentQuestion.correctAnswer ? 'text-emerald-400' : 'text-red-400'
                : 'text-gray-400'
            }`} />
            <span className="text-2xl font-bold">FAUX</span>
            <span className="text-sm text-gray-400 mt-2">Cette affirmation est incorrecte</span>
          </motion.button>
        </div>

        {/* Skip Button */}
        {!selectedAnswer && (
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Passer cette question
            </button>
          </div>
        )}
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && selectedAnswer && selectedAnswer !== 'skip' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                selectedAnswer === 'true' && currentQuestion.correctAnswer ||
                selectedAnswer === 'false' && !currentQuestion.correctAnswer
                  ? 'bg-emerald-400/10'
                  : 'bg-red-400/10'
              }`}>
                {selectedAnswer === 'true' && currentQuestion.correctAnswer ||
                 selectedAnswer === 'false' && !currentQuestion.correctAnswer ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold">
                  {selectedAnswer === 'true' && currentQuestion.correctAnswer ||
                   selectedAnswer === 'false' && !currentQuestion.correctAnswer
                    ? 'Bonne réponse !'
                    : 'Réponse incorrecte'}
                </h3>
                <p className="text-gray-400">
                  {selectedAnswer === 'true' && currentQuestion.correctAnswer ||
                   selectedAnswer === 'false' && !currentQuestion.correctAnswer
                    ? `+10 points + ${Math.floor(timeLeft / 2)} bonus temps`
                    : 'Analysez l\'explication ci-dessous'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Explication
              </h4>
              <p className="text-gray-300">{currentQuestion.explanation}</p>
              
              {currentQuestion.tip && (
                <div className="mt-4 p-4 bg-emerald-400/5 rounded-lg border border-emerald-400/20">
                  <div className="font-medium text-emerald-400 mb-1">💡 Conseil pratique</div>
                  <p className="text-sm text-gray-300">{currentQuestion.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {gameStats.correct}
          </div>
          <div className="text-gray-400">Correctes</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">
            {gameStats.incorrect}
          </div>
          <div className="text-gray-400">Incorrectes</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-amber-400 mb-2">
            {gameStats.skipped}
          </div>
          <div className="text-gray-400">Passées</div>
        </div>
      </div>
    </div>
  );
}