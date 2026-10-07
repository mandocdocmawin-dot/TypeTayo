// components/landing/HowItWorks.jsx
import SectionTitle from '../common/SectionTitle';
import { ClockIcon } from '../common/Icons';
import { BONUS_SECONDS } from '../../game/config';
import styles from './HowItWorks.module.css';

function PointerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M14 10V9a2 2 0 0 0-4 0v1M10 9.5V4a2 2 0 0 0-4 0v10M18 11v-1a2 2 0 0 0-4 0M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

const STEPS = [
  { text: 'Read the highlighted letter', icon: <span className={styles.keycap}>T</span> },
  { text: 'Follow the glowing finger', icon: <PointerIcon /> },
  {
    text: `Finish words to earn +${BONUS_SECONDS}s`,
    icon: (
      <>
        <ClockIcon />
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
            <div className={styles.icon} aria-hidden="true">{s.icon}</div>
            <p><span className={styles.num}>{i + 1}.</span> {s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}