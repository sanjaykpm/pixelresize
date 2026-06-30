'use client';

import * as React from 'react';

const STORAGE_KEY = 'pixelresize-favorites';
const MAX_FAVORITES = 20;

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // localStorage may not be available
    }
  }, []);

  const toggleFavorite = React.useCallback((tool: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(tool)) {
        updated = prev.filter((t) => t !== tool);
      } else {
        updated = [tool, ...prev].slice(0, MAX_FAVORITES);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const isFavorite = React.useCallback((tool: string) => favorites.includes(tool), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
