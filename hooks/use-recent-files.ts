'use client';

import * as React from 'react';

type RecentFile = {
  name: string;
  tool: string;
  timestamp: number;
};

const STORAGE_KEY = 'pixelresize-recent-files';
const MAX_RECENT = 10;

export function useRecentFiles() {
  const [recent, setRecent] = React.useState<RecentFile[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // localStorage may not be available
    }
  }, []);

  const addRecent = React.useCallback((name: string, tool: string) => {
    setRecent((prev) => {
      const entry: RecentFile = { name, tool, timestamp: Date.now() };
      const filtered = prev.filter((f) => !(f.name === name && f.tool === tool));
      const updated = [entry, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const clearRecent = React.useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { recent, addRecent, clearRecent };
}
