// hooks/useLocalStorage.js
// useState that is saved in localStorage. Never throws (private mode, blocked storage).
import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage not available: the value just lives in memory */
    }
  }, [key, value]);

  return [value, setValue];
}