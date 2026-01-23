'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useSession } from 'next-auth/react'; // <-- AJOUTER CET IMPORT

interface ScoreIndicatorProps {
  score: number;
  previousScore?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isGuestMode?: boolean; // <-- NOUVEAU PROP
}

const ScoreIndicator = ({ 
  score, 
  previousScore, 
  showLabel = true,
  size = 'md',
  isGuestMode = false // <-- NOUVEAU PROP PAR DÉFAUT
}: ScoreIndicatorProps) => {
  
  const { data: session } = useSession();
  
  // Déterminer si on est en mode invité
  const isGuest = isGuestMode || !session?.user;
  
  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };
  
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-emerald-400';
    if (value >= 60) return 'text-blue-400';
    if (value >= 40) return 'text-amber-400';
    return 'text-red-400';
  };
  
  const getTrend = () => {
    if (!previousScore) return null;
    const difference = score - previousScore;
    
    if (Math.abs(difference) < 1) return null;
    
    return {
      value: Math.abs(difference),
      direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
      percentage: Math.round((difference / previousScore) * 100)
    };
  };
  
  const trend = getTrend();
  const scoreColor = getScoreColor(score);

  return (
    <div className="flex flex-col">
      <div className="flex items-end gap-2">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`font-bold ${sizeStyles[size]} ${scoreColor}`}
        >
          {score}
        </motion.span>
        
        {showLabel && (
          <span className="text-gray-400 text-sm mb-1">/100</span>
        )}
        
        {/* Indicateur mode invité */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-2 py-1 text-xs bg-amber-400/10 text-amber-400 rounded-full"
          >
            Mode invité
          </motion.div>
        )}
        
        {trend && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
              trend.direction === 'up' 
                ? 'bg-emerald-400/10 text-emerald-400' 
                : trend.direction === 'down'
                ? 'bg-red-400/10 text-red-400'
                : 'bg-gray-400/10 text-gray-400'
            }`}
          >
            {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend.direction === 'stable' && <Minus className="w-3 h-3" />}
            <span>{Math.abs(trend.percentage)}%</span>
          </motion.div>
        )}
      </div>
      
      {/* Score bar */}
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Faible</span>
          <span>Moyen</span>
          <span>Bon</span>
          <span>Excellent</span>
        </div>
        
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${scoreColor.replace('text', 'bg')}`}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          {[0, 40, 60, 80, 100].map((mark) => (
            <div key={mark} className="relative">
              <div className={`w-1 h-1 rounded-full ${
                score >= mark ? 'bg-white' : 'bg-gray-600'
              }`} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Message de conseil */}
      {score < 60 && !isGuest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-xs text-amber-400"
        >
          Continuez à vous entraîner pour améliorer votre score !
        </motion.div>
      )}
      
      {isGuest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-xs text-blue-400"
        >
          Connectez-vous pour sauvegarder votre progression
        </motion.div>
      )}
    </div>
  );
};

export { ScoreIndicator };