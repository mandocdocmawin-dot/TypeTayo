// components/landing/Hero.jsx
// Headline + a looping demo of the real game parts (WordBox, Keyboard, Hands).
// The demo is decorative, so it is hidden from screen readers.
import { useEffect, useState } from 'react';
import WordBox from '../game/WordBox';
import Keyboard from '../keyboard/Keyboard';
import Hands, { HANDS_EXTRA_UNITS } from '../keyboard/Hands';
import { getHint } from '../../game/fingerMap';
import { START_SECONDS, BONUS_SECONDS } from '../../game/config';
import styles from './Hero.module.css';
import { SunIcon } from '../common/Icons';

const DEMO_WORD = 'keyboard';
const STEP_MS = 850;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Hero() {
  const reduced = prefersReducedMotion();
  const [index, setIndex] = useState(reduced ? 3 : 0); // static frame: "keyb|oard"

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => {
      // one extra tick after the last letter = short pause, then loop
      setIndex((i) => (i > DEMO_WORD.length ? 0 : i + 1));
    }, STEP_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const char = DEMO_WORD[index];
  const hint = char ? getHint(char) : null;
  const activeFingers = hint ? [hint.finger, hint.shiftFinger].filter(Boolean) : [];

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.text}`}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.brand}>
            Type<span className={styles.tayo}>Tayo</span>
            <SunIcon className={styles.sun} />
          </span>
          <span className={styles.tagline}>Beat the clock.</span>
        </h1>
        <p className={styles.sub}>
          Start with {START_SECONDS} seconds. Finish a word in the early levels, earn +{BONUS_SECONDS} seconds.
          <br />
          See your hands guide every key.
        </p>
      </div>

      <div className={`${styles.demo} no-select`} aria-hidden="true">
        <div className={styles.word}>
          <WordBox word={DEMO_WORD} index={Math.min(index, DEMO_WORD.length)} errors={0} status="playing" />
        </div>
        <div className={styles.board}>
          <Keyboard
            activeKey={hint?.keyId ?? null}
            shiftKey={hint?.shiftKeyId ?? null}
            belowUnits={HANDS_EXTRA_UNITS}
          >
            <Hands activeFingers={activeFingers} />
          </Keyboard>
        </div>
      </div>
    </section>
  );
}