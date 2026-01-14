'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Mettre à jour l'état initial
    setMatches(media.matches);
    
    // Écouter les changements
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    media.addEventListener('change', listener);
    
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}