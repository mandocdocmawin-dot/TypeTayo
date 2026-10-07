// components/game/WordBox.jsx
// Shows the current word as letter tiles: typed (green), current (cyan), upcoming (blurred).
// Shakes and flashes red whenever `errors` goes up.
// Phrases wrap between words (a space tile stays glued to the word before it).
import { useState } from 'react';
import { colorForChar } from '../../game/fingerColors';
import { getHint } from '../../game/fingerMap';
import styles from './WordBox.module.css';

// 'Fat Finger11' -> [[F,a,t,' '], [F,i,n,g,e,r,1,1]], each item keeps its index in the phrase
function groupByWord(word) {
  const groups = [];
  let current = [];
  word.split('').forEach((ch, i) => {
    current.push({ ch, i });
    if (ch === ' ') {
      groups.push(current);
      current = [];
    }
  });
  if (current.length) groups.push(current);
  return groups;
}

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
  const groups = visible ? groupByWord(word) : [];

  return (
    <div
      className={`${styles.box} no-select`}
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
        {groups.map((group, g) => (
          <span key={g} className={styles.group}>
            {group.map(({ ch, i }) => {
              const state =
                i < index ? styles.typed : i === index ? styles.current : styles.upcoming;
              const isSpace = ch === ' ';
              const needsShift = i === index && Boolean(getHint(ch)?.shiftKeyId);
              return (
                <span
                  key={i}
                  className={`${styles.tile} ${isSpace ? styles.space : ''} ${state}`}
                  style={{ '--tile-color': colorForChar(ch) }}
                >
                  {isSpace ? <span className={styles.spaceMark} /> : ch}
                  {needsShift && <small className={styles.badge}>Shift</small>}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
}