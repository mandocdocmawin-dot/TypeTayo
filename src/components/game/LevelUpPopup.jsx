// components/game/LevelUpPopup.jsx
// Pops up "Level N" for a moment when the stage goes up during a round.
// Put it inside a `position: relative` wrapper.
import { useState } from 'react';
import styles from './LevelUpPopup.module.css';

export default function LevelUpPopup({ stage, playing }) {
  const [prev, setPrev] = useState(stage);
  const [pop, setPop] = useState({ key: 0, visible: false });

  // Detect the change during render (same pattern as BonusPopup).
  if (stage !== prev) {
    setPrev(stage);
    setPop((p) =>
      stage > prev && playing ? { key: p.key + 1, visible: true } : { ...p, visible: false }
    );
  }

  if (!pop.visible) return null;

  return (
    <div
      key={pop.key} // new key restarts the animation
      className={styles.popup}
      onAnimationEnd={() => setPop((p) => ({ ...p, visible: false }))}
      aria-hidden="true"
    >
      <span className={styles.small}>Level up!</span>
      <span className={styles.big}>Level {stage}</span>
    </div>
  );
}