// pages/Play.jsx
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGame from '../hooks/useGame';
import { LEVELS } from '../game/config';
import easy from '../data/words/easy';
import medium from '../data/words/medium';
import hard from '../data/words/hard';
import Logo from '../components/common/Logo';
import WordBox from '../components/game/WordBox';
import Timer from '../components/game/Timer';
import BonusPopup from '../components/game/BonusPopup';
import Keyboard from '../components/keyboard/Keyboard';
import Hands, { HANDS_EXTRA_UNITS } from '../components/keyboard/Hands';
import useLocalStorage from '../hooks/useLocalStorage';
import { getHint } from '../game/fingerMap';
import styles from './Play.module.css';

const WORD_LISTS = { easy, medium, hard };
const randomWord = (list) => list[Math.floor(Math.random() * list.length)];

export default function Play() {
  const { level } = useParams();
  const navigate = useNavigate();
  const valid = LEVELS.includes(level);
  const game = useGame(valid ? level : 'easy');
  const { status, start, pause, resume, quit } = game;
  const [showHands, setShowHands] = useLocalStorage('typetayo:showHands', true);
  const previewWord = useMemo(
    () => randomWord(WORD_LISTS[level] ?? easy),
    [level]
  );

  useEffect(() => {
    function onEsc(e) {
      if (e.key !== 'Escape' || e.repeat) return;
      const wasPlaying = status === 'playing';
      if (wasPlaying) pause();
      if (window.confirm('Quit and go back to the home page?')) {
        quit();
        navigate('/');
      } else if (wasPlaying) {
        resume();
      }
    }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [status, pause, resume, quit, navigate]);

  useEffect(() => {
    function onToggle(e) {
      if (e.code !== 'Space' || !e.shiftKey) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.repeat) return;

      document.activeElement?.blur?.();

      if (status === 'idle' || status === 'finished') start();
      else if (status === 'playing') pause();
      else if (status === 'paused') resume();
    }

    window.addEventListener('keydown', onToggle, { capture: true });
    return () => window.removeEventListener('keydown', onToggle, { capture: true });
  }, [status, start, pause, resume]);

  if (!valid) {
    return <p>Unknown level: {level}</p>;
  }

  const { word, index, remainingMs, countdown, result } = game;
  const ready = status === 'idle' || status === 'finished';
  const shownWord = ready ? previewWord : word;
  const shownIndex = ready ? 0 : index;
  const guiding = status === 'countdown' || status === 'playing';
  const hint = guiding ? getHint(word[index]) : null;
  const activeFingers = hint ? [hint.finger, hint.shiftFinger].filter(Boolean) : [];

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <Logo height={44} />
          <h1 className="sr-only">Play {level}</h1>
        </div>

        <div className={styles.timerWrap}>
          <Timer remainingMs={remainingMs} />
          <BonusPopup bonusCount={game.bonusCount} />
        </div>

        <div className={styles.right}>
          <span className={styles.badge} data-level={level}>{level}</span>
          <ul className={styles.stats}>
            <li><span>score</span><b>{game.score}</b></li>
            <li><span>wpm</span><b>{game.wpm.toFixed(0)}</b></li>
            <li><span>accuracy</span><b>{game.accuracy.toFixed(0)}%</b></li>
            <li><span>errors</span><b>{game.errors}</b></li>
          </ul>
        </div>
      </header>

      <div className={styles.center}>
        <WordBox
          word={shownWord}
          index={shownIndex}
          errors={game.errors}
          status={ready ? 'playing' : status}
        />
        <p className={styles.hint} aria-live="polite">
          {status === 'idle' && 'Press Start or Shift + Space'}
          {status === 'countdown' && <span key={countdown} className={styles.count}>{countdown}</span>}
          {status === 'playing' && 'Press the highlighted key'}
          {status === 'paused' && 'Paused. Press Shift + Space to continue.'}
          {status === 'finished' && 'Time is up!'}
        </p>
      </div>

      <div className={`${styles.guide} no-select`}>
        <Keyboard
          activeKey={hint?.keyId ?? null}
          shiftKey={hint?.shiftKeyId ?? null}
          belowUnits={showHands ? HANDS_EXTRA_UNITS : 0}
        >
          {showHands && <Hands activeFingers={activeFingers} />}
        </Keyboard>
      </div>

      <footer className={styles.footer}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            role="switch"
            checked={showHands}
            onChange={(e) => {
              setShowHands(e.target.checked);
              e.target.blur();
            }}
          />
          <span>Show hands</span>
        </label>

        <div className={styles.controls}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={start}
            disabled={status === 'countdown' || status === 'playing'}>
            {status === 'finished' ? 'Play again' : 'Start'}
          </button>
          <button className={styles.btn} onClick={pause} disabled={status !== 'playing'}>Pause</button>
          <button className={styles.btn} onClick={resume} disabled={status !== 'paused'}>Resume</button>
          <button className={styles.btn} onClick={quit}>Reset</button>
          <span className={styles.note}>
            <kbd>Shift</kbd>+<kbd>Space</kbd> start/pause · <kbd>Esc</kbd> to quit
          </span>
        </div>
      </footer>

      {result && <pre className={styles.result}>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}