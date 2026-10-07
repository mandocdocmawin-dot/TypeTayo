// components/leaderboard/LevelTabs.jsx
// Controlled tab list: <LevelTabs value="medium" onChange={setLevel} />
import { LEVELS } from '../../game/config';
import styles from './LevelTabs.module.css';

const LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export default function LevelTabs({ value, onChange, idPrefix = 'lb' }) {
  function onKeyDown(e) {
    const i = LEVELS.indexOf(value);
    if (e.key === 'ArrowRight') onChange(LEVELS[(i + 1) % LEVELS.length]);
    if (e.key === 'ArrowLeft') onChange(LEVELS[(i - 1 + LEVELS.length) % LEVELS.length]);
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label="Leaderboard level" onKeyDown={onKeyDown}>
      {LEVELS.map((lv) => (
        <button
          key={lv}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${lv}`}
          aria-selected={value === lv}
          aria-controls={`${idPrefix}-panel`}
          tabIndex={value === lv ? 0 : -1}
          data-level={lv}
          className={styles.tab}
          onClick={() => onChange(lv)}
        >
          {LABELS[lv]}
        </button>
      ))}
    </div>
  );
}