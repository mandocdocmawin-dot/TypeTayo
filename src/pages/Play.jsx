// pages/Play.jsx
// Debug version: raw state only, no styling. Replaced by WordBox/Timer/BonusPopup later.
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGame from '../hooks/useGame';

const LEVELS = ['easy', 'medium', 'hard'];

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
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <h1>Play (debug) - {level}</h1>

      <p>
        status: <b>{status}</b>
        {status === 'countdown' && ` (${countdown})`}
      </p>

      <p style={{ fontSize: 32 }}>
        <span style={{ color: 'lime' }}>{word.slice(0, index)}</span>
        <span style={{ color: 'cyan', textDecoration: 'underline' }}>{word[index]}</span>
        <span style={{ opacity: 0.5 }}>{word.slice(index + 1)}</span>
      </p>

      <ul>
        <li>time left: {(remainingMs / 1000).toFixed(1)}s</li>
        <li>score: {game.score}</li>
        <li>bonusCount: {game.bonusCount}</li>
        <li>errors: {game.errors}</li>
        <li>wpm: {game.wpm.toFixed(1)}</li>
        <li>accuracy: {game.accuracy.toFixed(1)}%</li>
      </ul>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={game.start} disabled={status === 'countdown' || status === 'playing'}>
          {status === 'finished' ? 'Play again' : 'Start'}
        </button>
        <button onClick={pause} disabled={status !== 'playing'}>Pause</button>
        <button onClick={resume} disabled={status !== 'paused'}>Resume</button>
        <button onClick={quit}>Reset</button>
      </div>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}

      <p>Esc = quit (with confirm)</p>
    </div>
  );
}