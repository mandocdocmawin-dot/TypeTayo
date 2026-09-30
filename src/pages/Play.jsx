// pages/Play.jsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGame from '../hooks/useGame';
import { LEVELS } from '../game/config';
import WordBox from '../components/game/WordBox';
import Timer from '../components/game/Timer';
import BonusPopup from '../components/game/BonusPopup';
import styles from './Play.module.css';

export default function Play() {
  const { level } = useParams();
  const navigate = useNavigate();
  const valid = LEVELS.includes(level);
  const game = useGame(valid ? level : 'easy');
  const { status, pause, resume, quit } = game;

  // Esc is handled here, not in useKeyCapture
  useEffect(() => {
    function onEsc(e) {
      if (e.key !== 'Escape' || e.repeat) return;
      const wasPlaying = status === 'playing';
      if (wasPlaying) pause(); // the clock must not run while the confirm is open
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

  if (!valid) {
    return <p>Unknown level: {level}</p>;
  }

  const { word, index, remainingMs, countdown, result } = game;

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Play</h1>
        <span className={styles.badge} data-level={level}>{level}</span>
      </header>

      <div className={styles.timerWrap}>
        <Timer remainingMs={remainingMs} />
        <BonusPopup bonusCount={game.bonusCount} />
      </div>

      <WordBox word={word} index={index} errors={game.errors} status={status} />

      <p className={styles.hint} aria-live="polite">
        {status === 'idle' && 'Press Start'}
        {status === 'countdown' && <span className={styles.count}>{countdown}</span>}
        {status === 'paused' && 'Paused. Press Resume to continue.'}
        {status === 'finished' && 'Time is up!'}
      </p>

      <ul className={styles.stats}>
        <li><b>{game.score}</b> score</li>
        <li><b>{game.wpm.toFixed(0)}</b> wpm</li>
        <li><b>{game.accuracy.toFixed(1)}%</b> accuracy</li>
        <li><b>{game.errors}</b> errors</li>
      </ul>

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.primary}`}
          onClick={game.start}
          disabled={status === 'countdown' || status === 'playing'}
        >
          {status === 'finished' ? 'Play again' : 'Start'}
        </button>
        <button className={styles.btn} onClick={pause} disabled={status !== 'playing'}>Pause</button>
        <button className={styles.btn} onClick={resume} disabled={status !== 'paused'}>Resume</button>
        <button className={styles.btn} onClick={quit}>Reset</button>
      </div>

      {result && <pre className={styles.result}>{JSON.stringify(result, null, 2)}</pre>}

      <p className={styles.note}>Esc = quit (with confirm)</p>
    </div>
  );
}