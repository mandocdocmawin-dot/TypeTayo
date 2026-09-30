// components/game/Timer.jsx
// Big countdown number + progress bar. The bar is full at START_SECONDS
// (extra bonus time just keeps it full). Turns orange at 10s and red at 5s.
import { START_SECONDS } from '../../game/config';
import styles from './Timer.module.css';

const WARN_MS = 10_000;
const DANGER_MS = 5_000;

export default function Timer({ remainingMs, maxMs = START_SECONDS * 1000 }) {
  const ms = Math.max(0, remainingMs);
  const ratio = Math.min(1, ms / maxMs);
  const tone = ms <= DANGER_MS ? styles.danger : ms <= WARN_MS ? styles.warn : styles.ok;
  const seconds = ms / 1000;

  return (
    <div className={`${styles.timer} ${tone}`}>
      <div className={styles.time} aria-hidden="true">
        {seconds.toFixed(1)}
        <span className={styles.unit}>s</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Time left"
        aria-valuemin={0}
        aria-valuemax={Math.round(maxMs / 1000)}
        aria-valuenow={Math.min(Math.round(maxMs / 1000), Math.ceil(seconds))}
      >
        <div className={styles.fill} style={{ transform: `scaleX(${ratio})` }} />
      </div>
    </div>
  );
}