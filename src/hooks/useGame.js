// hooks/useGame.js
import { useReducer, useRef, useState, useEffect, useCallback } from 'react';
import { gameReducer, initialState } from '../game/gameReducer';
import { createPicker } from '../game/wordPicker';
import { calcWpm, calcAccuracy } from '../game/scoring';
import { START_SECONDS, BONUS_SECONDS } from '../game/config';
import useKeyCapture from './useKeyCapture';
import easy from '../data/words/easy';
import medium from '../data/words/medium';
import hard from '../data/words/hard';

const WORDS = { easy, medium, hard };
const START_MS = START_SECONDS * 1000;
const BONUS_MS = BONUS_SECONDS * 1000;

export default function useGame(level) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [runningMs, setRunningMs] = useState(START_MS); // oras na natitira habang playing

  const pickerRef = useRef(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 1. Simula ng laro
  const start = useCallback(() => {
    pickerRef.current = createPicker(WORDS[level]);
    setRunningMs(START_MS);
    dispatch({ type: 'START', level, firstWord: pickerRef.current.next() });
  }, [level]);

  // 2. Countdown 3-2-1, tapos BEGIN
  useEffect(() => {
    if (state.status !== 'countdown') return;
    if (state.countdown === 0) {
      dispatch({ type: 'BEGIN', now: performance.now() });
      return;
    }
    const id = setTimeout(() => dispatch({ type: 'COUNTDOWN_TICK' }), 1000);
    return () => clearTimeout(id);
  }, [state.status, state.countdown]);

  // 3. Timer loop: nagpapakita ng oras at nagta-trigger ng FINISH
  useEffect(() => {
    if (state.status !== 'playing') return;
    let raf;
    let last = 0;
    const loop = () => {
      const now = performance.now();
      const endsAt = stateRef.current.endsAt;
      if (endsAt != null) {
        if (now >= endsAt) {
          setRunningMs(0);
          dispatch({ type: 'FINISH', now });
          return;
        }
        if (now - last >= 100) {
          last = now;
          setRunningMs(endsAt - now); // ~10 beses/segundo lang, hindi 60
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state.status]);

  // 4. Auto-pause kapag nawala ang focus
  useEffect(() => {
    if (state.status !== 'playing') return;
    const pause = () => dispatch({ type: 'PAUSE', now: performance.now() });
    const onVisibility = () => document.hidden && pause();
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', pause);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [state.status]);

  // 5. Keyboard: tinatawag lang ang picker.next() kapag matatapos na ang word
  const onKey = useCallback((key) => {
    const s = stateRef.current;
    const completes = key === s.word[s.index] && s.index + 1 === s.word.length;
    dispatch({
      type: 'KEY',
      key,
      now: performance.now(),
      nextWord: completes ? pickerRef.current.next() : null,
    });
  }, []);
  useKeyCapture(onKey, state.status === 'playing');

  const pause = useCallback(() => dispatch({ type: 'PAUSE', now: performance.now() }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME', now: performance.now() }), []);
  const quit = useCallback(() => dispatch({ type: 'RESET' }), []);

  // Derived values
  const { status } = state;
  const remainingMs =
    status === 'finished' ? 0 : status === 'paused' ? state.remainingMs : runningMs;

  // oras na naglaro = kabuuang nakuhang oras - natitira
  const elapsedMs =
    status === 'finished'
      ? state.playedMs
      : Math.max(0, START_MS + state.bonusCount * BONUS_MS - remainingMs);

  const wpm = elapsedMs < 1000 ? 0 : calcWpm(state.correctKeys, elapsedMs);
  const accuracy = calcAccuracy(state.correctKeys, state.totalKeys);

  return {
    status,
    level: state.level,
    countdown: state.countdown,
    word: state.word,
    index: state.index,
    score: state.score,
    errors: state.errors,
    bonusCount: state.bonusCount,
    remainingMs,
    wpm,
    accuracy,
    // handa na para sa submitScore (Section 10 ng plan)
    result:
      status === 'finished'
        ? {
            level: state.level,
            score: state.score,
            wpm,
            accuracy,
            durationMs: state.playedMs,
            keystrokes: state.totalKeys,
          }
        : null,
    start,
    pause,
    resume,
    quit,
  };
}