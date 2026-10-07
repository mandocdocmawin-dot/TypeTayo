// components/game/QuitModal.jsx
// "Quit and go back home?" confirmation. Esc = keep playing, Tab stays inside.
import { useEffect, useRef } from 'react';
import styles from './QuitModal.module.css';

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export default function QuitModal({ onStay, onQuit }) {
  const dialogRef = useRef(null);
  const stayRef = useRef(null);

  // Focus "Keep playing" (the safe choice) and give focus back on close.
  useEffect(() => {
    const previous = document.activeElement;
    stayRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  // Capture phase so Play's own Esc handler never sees this Esc.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!e.repeat) onStay();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [onStay]);

  return (
    <div className={styles.overlay} onClick={onStay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="quit-title"
        aria-describedby="quit-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="quit-title" className={styles.title}>Quit this round?</h2>
        <p id="quit-desc" className={styles.desc}>
          Your progress will be lost and you will go back to the home page.
        </p>

        <div className={styles.actions}>
          <button
            ref={stayRef}
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            onClick={onStay}
          >
            Keep playing
          </button>
          <button type="button" className={`${styles.btn} ${styles.danger}`} onClick={onQuit}>
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}