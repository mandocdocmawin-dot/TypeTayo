// hooks/useKeyCapture.js
import { useEffect, useRef } from 'react';

// Keys na pipigilan ang default behavior (scroll, quick find)
const BLOCKED = new Set([' ', "'", '/']);

export default function useKeyCapture(onKey, enabled = true) {
  // ref para hindi mag-reattach ang listener sa bawat render
  const handlerRef = useRef(onKey);
  useEffect(() => {
    handlerRef.current = onKey;
  }, [onKey]);

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e) {
      if (e.repeat) return;                    // hawak na key
      if (e.ctrlKey || e.metaKey) return;      // hayaan ang Ctrl+R, Ctrl+C, atbp.
      if (e.key.length !== 1) return;          // Shift, Alt, Tab, F5, Enter... ay hindi letra
      if (BLOCKED.has(e.key)) e.preventDefault();
      handlerRef.current(e.key);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}