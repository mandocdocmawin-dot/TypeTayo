// hooks/useTheme.js
// Dark is the default. The choice is saved in localStorage as plain 'dark' | 'light'.
import { useCallback, useEffect, useState } from 'react';

const KEY = 'typetayo:theme';

function readTheme() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* storage blocked: fall back to dark */
  }
  return 'dark';
}

// Call once at startup (App.jsx) so every page, including /play, gets the saved theme
export function initTheme() {
  document.documentElement.dataset.theme = readTheme();
}

export default function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}