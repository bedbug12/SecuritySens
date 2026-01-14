'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, XCircle, Shield } from 'lucide-react';

interface AlertBadgeProps {
  type: 'success' | 'warning' | 'error' | 'info' | 'security';
  message: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

const AlertBadge = ({ 
  type, 
  message, 
  size = 'md', 
  className = '',
  pulse = false 
}: AlertBadgeProps) => {
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const typeConfig = {
    success: {
      bg: 'bg-emerald-400/10',
      text: 'text-emerald-400',
      border: 'border-emerald-400/20',
      icon: <CheckCircle className="w-4 h-4" />
    },
    warning: {
      bg: 'bg-amber-400/10',
      text: 'text-amber-400',
      border: 'border-amber-400/20',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    error: {
      bg: 'bg-red-400/10',
      text: 'text-red-400',
      border: 'border-red-400/20',
      icon: <XCircle className="w-4 h-4" />
    },
    info: {
      bg: 'bg-blue-400/10',
      text: 'text-blue-400',
      border: 'border-blue-400/20',
      icon: <Info className="w-4 h-4" />
    },
    security: {
      bg: 'bg-purple-400/10',
      text: 'text-purple-400',
      border: 'border-purple-400/20',
      icon: <Shield className="w-4 h-4" />
    }
  };
  
  const config = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${sizeStyles[size]} 
        ${config.bg} 
        ${config.text} 
        border 
        ${config.border} 
        rounded-lg 
        flex 
        items-center 
        gap-2 
        w-fit 
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {config.icon}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

export { AlertBadge };