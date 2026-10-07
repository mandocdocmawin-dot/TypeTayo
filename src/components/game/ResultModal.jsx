// components/game/ResultModal.jsx
// Shown when a round finishes: stats and next actions.
import { useEffect, useRef } from 'react';
import styles from './ResultModal.module.css';

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export default function ResultModal({
  result,
  errors,
  onPlayAgain,
  onChangeLevel,
  onViewLeaderboard,
  onClose,
}) {
  const dialogRef = useRef(null);
  const primaryRef = useRef(null);

  // Move focus into the dialog on open, give it back to the old element on close.
  useEffect(() => {
    const previous = document.activeElement;
    primaryRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  // Capture phase: Esc closes the modal only (Play's "Quit?" Esc never sees it), Tab stays inside.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
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
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="result-title" className={styles.title}>Time is up!</h2>
        <p className={styles.level} data-level={result.level}>{result.level}</p>

        <dl className={styles.stats}>
          <div><dt>Score</dt><dd>{result.score}</dd></div>
          <div><dt>WPM</dt><dd>{Math.round(result.wpm)}</dd></div>
          <div><dt>Accuracy</dt><dd>{result.accuracy.toFixed(0)}%</dd></div>
          <div><dt>Errors</dt><dd>{errors}</dd></div>
        </dl>

        <div className={styles.actions}>
          <button
            ref={primaryRef}
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            onClick={onPlayAgain}
          >
            Play again
          </button>
          <button type="button" className={styles.btn} onClick={onChangeLevel}>
            Change level
          </button>
          <button type="button" className={styles.btn} onClick={onViewLeaderboard}>
            View leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}