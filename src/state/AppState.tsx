import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface AppState {
  favorites: string[];
  compare: string[];
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isFavorite: (id: string) => boolean;
  isCompared: (id: string) => boolean;
}

const Ctx = createContext<AppState | null>(null);
export const MAX_COMPARE = 3;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= MAX_COMPARE) return [...c.slice(1), id];
      return [...c, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const value = useMemo<AppState>(
    () => ({
      favorites,
      compare,
      toggleFavorite,
      toggleCompare,
      clearCompare,
      isFavorite: (id) => favorites.includes(id),
      isCompared: (id) => compare.includes(id),
    }),
    [favorites, compare, toggleFavorite, toggleCompare, clearCompare],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState must be used inside AppStateProvider');
  return v;
}
