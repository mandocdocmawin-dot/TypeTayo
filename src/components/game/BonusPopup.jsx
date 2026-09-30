// components/game/BonusPopup.jsx
// Floats "+3s" up and fades out each time bonusCount increases.
// Put it inside a `position: relative` wrapper (e.g. next to the Timer).
import { useState } from 'react';
import { BONUS_SECONDS } from '../../game/config';
import styles from './BonusPopup.module.css';

export default function BonusPopup({ bonusCount }) {
  const [prev, setPrev] = useState(bonusCount);
  const [pop, setPop] = useState({ key: 0, visible: false });

  if (bonusCount !== prev) {
    setPrev(bonusCount);
    setPop((p) =>
      bonusCount > prev ? { key: p.key + 1, visible: true } : { ...p, visible: false }
    );
  }

  if (!pop.visible) return null;

  return (
    <span
      key={pop.key} // new key restarts the animation on back-to-back bonuses
      className={styles.popup}
      onAnimationEnd={() => setPop((p) => ({ ...p, visible: false }))}
      aria-hidden="true"
    >
      +{BONUS_SECONDS}s
    </span>
  );
}