'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types de thème
export type Theme = 'light' | 'dark' | 'cyber' | 'system';

// Interface pour le contexte
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  isCyberMode: boolean;
  toggleCyberMode: () => void;
}

// Création du contexte
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'dark',
  toggleTheme: () => {},
  isCyberMode: false,
  toggleCyberMode: () => {}
});

// Props pour le provider
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

// Provider principal
export function ThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    
    try {
      const saved = localStorage.getItem('security-sense-theme');
      if (saved && ['light', 'dark', 'cyber', 'system'].includes(saved)) {
        return saved as Theme;
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
    }
    
    return defaultTheme;
  });

  const [isCyberMode, setIsCyberMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const saved = localStorage.getItem('security-sense-cyber-mode');
      return saved === 'true';
    } catch (error) {
      console.error('Error loading cyber mode from localStorage:', error);
    }
    
    return false;
  });

  // Déterminer le thème résolu (light ou dark)
  const resolvedTheme = ((): 'light' | 'dark' => {
    if (theme === 'system') {
      if (typeof window === 'undefined') return 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'light' ? 'light' : 'dark';
  })();

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    
    // Supprimer les anciennes classes
    root.classList.remove('light', 'dark', 'cyber-theme');
    
    // Ajouter la classe du thème résolu
    root.classList.add(resolvedTheme);
    
    // Ajouter la classe cyber si activé
    if (isCyberMode) {
      root.classList.add('cyber-theme');
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('security-sense-theme', theme);
    localStorage.setItem('security-sense-cyber-mode', isCyberMode.toString());
  }, [theme, resolvedTheme, isCyberMode]);

  // Écouter les changements de préférence système
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Forcer le re-render quand la préférence système change
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
      document.documentElement.classList.toggle('light', !mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Basculer entre light/dark
  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'system') return 'dark';
      if (current === 'dark') return 'light';
      if (current === 'light') return 'cyber';
      return 'system';
    });
  };

  // Basculer le mode cyber
  const toggleCyberMode = () => {
    setIsCyberMode(current => !current);
  };

  // Valeur du contexte
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    isCyberMode,
    toggleCyberMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useThemeContext() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  
  return context;
}

// Hook simplifié avec alias
export const useTheme = useThemeContext;