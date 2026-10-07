// components/landing/HowItWorks.jsx
import SectionTitle from '../common/SectionTitle';
import { BONUS_SECONDS, NO_BONUS_FROM_STAGE } from '../../game/config';
import styles from './HowItWorks.module.css';

function PointerIcon() {
  return (
    <span className={styles.pointer}>
      <span className={styles.dot} />
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M14 10V9a2 2 0 0 0-4 0v1M10 9.5V4a2 2 0 0 0-4 0v10M18 11v-1a2 2 0 0 0-4 0M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    </span>
  );
}

function StopwatchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4M9.5 2.5h5M12 2.5v3.5M18.5 6l1.5-1.5" />
    </svg>
  );
}

const STEPS = [
  { text: 'Read the highlighted letter', icon: <span className={styles.keycap}>T</span> },
  { text: 'Follow the glowing finger', icon: <PointerIcon /> },
  {
    text: `Finish words in Levels 1-${NO_BONUS_FROM_STAGE - 1} to earn +${BONUS_SECONDS}s`,
    icon: (
      <>
        <span className={styles.clock}><StopwatchIcon /></span>
        <span className={styles.bonus}>+{BONUS_SECONDS}s</span>
      </>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={`container ${styles.section}`} aria-labelledby="how-title">
      <SectionTitle id="how-title">How It Works</SectionTitle>
      <ol className={styles.steps}>
        {STEPS.map((s, i) => (
          <li key={s.text} className={styles.step}>
            <div className={styles.visual} aria-hidden="true">
              <div className={styles.icon}>{s.icon}</div>
              <span className={styles.badge}>{i + 1}</span>
            </div>
            <p><span className={styles.num}>{i + 1}.</span> {s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}