// pages/Play.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGame from '../hooks/useGame';
import { LEVELS } from '../game/config';
import Logo from '../components/common/Logo';
import QuitModal from '../components/game/QuitModal';
import WordBox from '../components/game/WordBox';
import Timer from '../components/game/Timer';
import LevelUpPopup from '../components/game/LevelUpPopup';
import BonusPopup from '../components/game/BonusPopup';
import ResultModal from '../components/game/ResultModal';
import Keyboard from '../components/keyboard/Keyboard';
import Hands, { HANDS_EXTRA_UNITS } from '../components/keyboard/Hands';
import useLocalStorage from '../hooks/useLocalStorage';
import { getHint } from '../game/fingerMap';
import styles from './Play.module.css';

export default function Play() {
  const { level } = useParams();
  const navigate = useNavigate();
  const valid = LEVELS.includes(level);
  const game = useGame(valid ? level : 'easy');
  const { status, word, index, start, pause, resume, quit } = game;
  const [showHands, setShowHands] = useLocalStorage('typetayo:showHands', true);
  const [dismissed, setDismissed] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const resumeAfterRef = useRef(false);

  useEffect(() => {
    if (status !== 'finished') setDismissed(false);
  }, [status]);

  useEffect(() => {
    function onEsc(e) {
      if (e.key !== 'Escape' || e.repeat || confirmQuit) return;

      resumeAfterRef.current = status === 'playing';
      if (status === 'playing') pause();
      else if (status === 'countdown') quit(); 
      setConfirmQuit(true);
    }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [status, confirmQuit, pause, quit]);

  useEffect(() => {
    function onToggle(e) {
      if (e.code !== 'Space' || !e.shiftKey) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (confirmQuit) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      if (status === 'playing' && word[index] === ' ') return;

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
  }, [status, word, index, confirmQuit, start, pause, resume]);

  if (!valid) {
    return <p>Unknown level: {level}</p>;
  }

  const { remainingMs, countdown, result } = game;
  const ready = status === 'idle' || status === 'finished';
  const guiding = status === 'countdown' || status === 'playing';
  const hint = guiding ? getHint(word[index]) : null;

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
          <span key={game.stage} className={styles.stage}>Level {game.stage}</span>
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
          word={word}
          index={index}
          errors={game.errors}
          status={ready ? 'playing' : status}
        />
        <p className={styles.hint} aria-live="polite">
          {status === 'idle' && 'Press Start or Shift + Space'}
          {status === 'countdown' && <span key={countdown} className={styles.count}>{countdown}</span>}
          {status === 'playing' && 'Press the highlighted key'}
          {status === 'paused' && 'Paused. Press Shift + Space to continue.'}
          {status === 'finished' && (game.completed ? 'You finished all levels!' : 'Time is up!')}
        </p>
        <LevelUpPopup stage={game.stage} playing={status === 'playing'} />
      </div>

      <div className={`${styles.guide} no-select`}>
        <Keyboard
          activeKey={hint?.keyId ?? null}
          shiftKey={hint?.shiftKeyId ?? null}
          belowUnits={showHands ? HANDS_EXTRA_UNITS : 0}
        >
          {showHands && <Hands />}
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

      {result && !dismissed && (
        <ResultModal
          result={result}
          errors={game.errors}
          onPlayAgain={start}
          onChangeLevel={() => {
            quit();
            navigate('/');
          }}
          onViewLeaderboard={() => navigate('/leaderboard')}
          onClose={() => setDismissed(true)}
        />
      )}

      {confirmQuit && (
        <QuitModal
          onStay={() => {
            setConfirmQuit(false);
            if (resumeAfterRef.current) resume();
          }}
          onQuit={() => {
            setConfirmQuit(false);
            quit();
            navigate('/');
          }}
        />
      )}
    </div>
  );
}