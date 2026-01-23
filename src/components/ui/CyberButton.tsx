'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  pending?: boolean; // <-- NOUVEAU PROP pour les sauvegardes
  glow?: boolean;
}

// Type pour combiner nos props avec les props motion
type CombinedProps = CyberButtonProps & MotionProps;

const CyberButton = forwardRef<HTMLButtonElement, CombinedProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    icon, 
    iconPosition = 'left',
    loading = false,
    pending = false, // <-- NOUVEAU PROP
    glow = false,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    
    const baseStyles = 'relative font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3.5 text-lg'
    };
    
    const variantStyles = {
      primary: 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl',
      outline: 'border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400',
      ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white',
      danger: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
    };
    
    const glowEffect = glow ? 'before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-blue-500 before:to-emerald-500 before:blur-md before:opacity-50 before:-z-10' : '';

    // Filtrer les props motion qui pourraient causer des conflits
    const motionProps: MotionProps = {
      whileHover: disabled ? undefined : { scale: 1.02 },
      whileTap: disabled ? undefined : { scale: 0.98 },
      ...props
    };

    // Supprimer les props spécifiques à motion que nous ne voulons pas
    const { onDrag, onDragStart, onDragEnd, drag, dragConstraints, dragElastic, dragMomentum, ...restProps } = motionProps;

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowEffect} ${className}`}
        disabled={disabled || loading || pending} // <-- INCLURE pending
        {...restProps}
      >
        {/* Loading spinner */}
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        )}
        
        {/* Pending state (pour les sauvegardes) */}
        {pending && !loading && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-4 h-4 bg-blue-400 rounded-full"
          />
        )}
        
        {!loading && !pending && icon && iconPosition === 'left' && icon}
        <span className="whitespace-nowrap">
          {pending ? 'Sauvegarde...' : children}
        </span>
        {!loading && !pending && icon && iconPosition === 'right' && icon}
        
        {/* Cyber effect */}
        <div className="absolute inset-0 rounded-lg overflow-hidden opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        {/* Pending border animation */}
        {pending && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-lg border-2 border-transparent border-t-blue-400 border-r-emerald-400"
          />
        )}
      </motion.button>
    );
  }
);

CyberButton.displayName = 'CyberButton';

export { CyberButton };