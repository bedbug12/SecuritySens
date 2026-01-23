'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react'; // <-- AJOUTER CET IMPORT

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
  gradient?: boolean;
  isGuestMode?: boolean; // <-- NOUVEAU PROP
}

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  showPercentage = true,
  gradient = true,
  isGuestMode = false // <-- NOUVEAU PROP
}: ProgressRingProps) => {
  
  const { data: session } = useSession();
  const isGuest = isGuestMode || !session?.user;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const getColor = (value: number) => {
    if (value >= 80) return '#10B981';
    if (value >= 60) return '#3B82F6';
    if (value >= 40) return '#F59E0B';
    return '#EF4444';
  };
  
  const getGradientId = `gradient-${progress}`;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-gray-800"
        />
        
        {/* Gradient definition */}
        {gradient && (
          <defs>
            <linearGradient id={getGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        )}
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-linecap-round"
          stroke={gradient ? `url(#${getGradientId})` : getColor(progress)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white"
          >
            {progress}%
          </motion.span>
        )}
        {label && (
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        )}
      </div>
      
      {/* Mode invité indicator */}
      {isGuest && (
        <div className="absolute -top-2 -right-2">
          <div className="px-2 py-1 text-xs bg-amber-400/20 text-amber-400 rounded-full border border-amber-400/30">
            Invité
          </div>
        </div>
      )}
      
      {/* Outer glow effect */}
      {progress >= 80 && (
        <div className="absolute inset-0 rounded-full animate-pulse-glow" />
      )}
    </div>
  );
};

export { ProgressRing };