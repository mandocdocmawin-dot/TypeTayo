// components/game/WordBox.jsx
// Shows the current word as letter tiles: typed (green), current (cyan), upcoming (blurred).
// Shakes and flashes red whenever `errors` goes up.
import { useState } from 'react';
import styles from './WordBox.module.css';

export default function WordBox({ word, index, errors, status }) {
  const [prevErrors, setPrevErrors] = useState(errors);
  const [shake, setShake] = useState({ key: 0, active: false });

  // Detect a new error during render (no effect needed).
  if (errors !== prevErrors) {
    setPrevErrors(errors);
    setShake((s) =>
      errors > prevErrors ? { key: s.key + 1, active: true } : { ...s, active: false }
    );
  }

  const visible = status === 'countdown' || status === 'playing' || status === 'paused';
  const letters = visible ? word.split('') : [];

  return (
    <div
      className={styles.box}
      role="img"
      aria-label={visible ? `Type the word: ${word}` : 'Word area'}
    >
      {/* new key on every error restarts the shake animation */}
      <div
        key={shake.key}
        className={[
          styles.letters,
          status === 'paused' ? styles.paused : '',
          shake.active ? styles.shake : '',
        ].join(' ')}
        onAnimationEnd={() => setShake((s) => (s.active ? { ...s, active: false } : s))}
        aria-hidden="true"
      >
        {letters.map((ch, i) => {
          const state = i < index ? styles.typed : i === index ? styles.current : styles.upcoming;
          return (
            <span key={i} className={`${styles.tile} ${state}`}>
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
}