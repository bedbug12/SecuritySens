import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Couleurs cyber personnalisées
        cyber: {
          blue: '#3b82f6',
          emerald: '#10b981',
          purple: '#8b5cf6',
          pink: '#ec4899',
          amber: '#f59e0b',
          red: '#ef4444',
          cyan: '#06b6d4',
          violet: '#7c3aed',
        },
        // Dégradés cyber
        gradient: {
          'cyber-blue': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          'cyber-emerald': 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
          'cyber-purple': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          'cyber-danger': 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
          'matrix': 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        cyber: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        // Animations de base
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        
        // Animations cyber
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'cyber-scan': 'cyberScan 3s linear infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.5s infinite',
        'binary': 'binaryFlow 10s linear infinite',
        
        // Animations UI
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'progress': 'progress 1s ease-in-out infinite',
        
        // Animations de notifications
        'toast-in': 'toastIn 0.3s ease-out',
        'toast-out': 'toastOut 0.3s ease-in',
      },
      keyframes: {
        // Animations de base
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Animations cyber
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
          },
        },
        cyberScan: {
          '0%': { 
            backgroundPosition: '0% 0%',
          },
          '100%': { 
            backgroundPosition: '100% 100%',
          },
        },
        matrixRain: {
          '0%': { 
            transform: 'translateY(-100%)',
          },
          '100%': { 
            transform: 'translateY(100%)',
          },
        },
        shimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
          },
          '100%': { 
            backgroundPosition: '200% 0',
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px)',
          },
          '50%': { 
            transform: 'translateY(-20px)',
          },
        },
        glitch: {
          '0%': { 
            transform: 'translate(0)',
          },
          '20%': { 
            transform: 'translate(-2px, 2px)',
          },
          '40%': { 
            transform: 'translate(-2px, -2px)',
          },
          '60%': { 
            transform: 'translate(2px, 2px)',
          },
          '80%': { 
            transform: 'translate(2px, -2px)',
          },
          '100%': { 
            transform: 'translate(0)',
          },
        },
        binaryFlow: {
          '0%': { 
            transform: 'translateY(-100%)',
          },
          '100%': { 
            transform: 'translateY(100%)',
          },
        },
        
        // Animations UI
        progress: {
          '0%': { 
            width: '0%',
          },
          '100%': { 
            width: '100%',
          },
        },
        
        // Animations de notifications
        toastIn: {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        toastOut: {
          '0%': { 
            transform: 'translateX(0)',
            opacity: '1',
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
      },
      backgroundImage: {
        // Backgrounds cyber
        'cyber-grid': `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
        'cyber-dots': `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
        'cyber-lines': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(59, 130, 246, 0.1) 2px,
          rgba(59, 130, 246, 0.1) 4px
        )`,
        'matrix-pattern': `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
        
        // Dégradés
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        
        // Dégradés cyber spécifiques
        'cyber-blue-gradient': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        'cyber-green-gradient': 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
        'cyber-purple-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        'cyber-danger-gradient': 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        'cyber-matrix-gradient': 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
      },
      backgroundSize: {
        'cyber-grid-size': '50px 50px',
        'cyber-dots-size': '20px 20px',
        'matrix-size': '40px 40px',
      },
      boxShadow: {
        // Ombres cyber
        'cyber': '0 0 20px rgba(59, 130, 246, 0.3)',
        'cyber-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
        'cyber-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
        'cyber-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'cyber-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        
        // Ombres avec bordure intérieure
        'inner-cyber': 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
        'inner-cyber-lg': 'inset 0 0 40px rgba(59, 130, 246, 0.2)',
        
        // Ombres de profondeur
        'depth-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'depth-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'depth-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'depth-4': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'depth-5': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      },
      backdropBlur: {
        xs: '2px',
      },
      blur: {
        '4xl': '72px',
        '5xl': '96px',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'shadow': 'box-shadow',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      rotate: {
        '135': '135deg',
        '225': '225deg',
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
      // Plugin pour les coupes de texte
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      },
    },
  },
  plugins: [
  
    // Plugin personnalisé pour les effets cyber
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        // Effet de scan line
        '.scan-line': {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)',
            animation: 'cyberScan 3s linear infinite',
            zIndex: '10',
          },
        },
        // Effet de texte binaire
        '.binary-text': {
          fontFamily: 'var(--font-jetbrains)',
          background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animation: 'shimmer 2s infinite',
        },
        // Effet de bordure cyber
        '.cyber-border': {
          position: 'relative',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, #3b82f6, #10b981, #8b5cf6)',
            borderRadius: 'inherit',
            zIndex: '-1',
            animation: 'shimmer 3s infinite',
          },
        },
        // Effet de glass morphism cyber
        '.cyber-glass': {
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        // Effet de matrix
        '.matrix-bg': {
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, rgba(15, 23, 42, 1) 0%, rgba(2, 6, 23, 1) 100%)
          `,
        },
        // Scrollbar personnalisée
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(30, 41, 59, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #3b82f6, #10b981)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(180deg, #2563eb, #059669)',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;