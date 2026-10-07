// game/gameReducer.js
import {
  START_SECONDS,
  COUNTDOWN_SECONDS,
  MAX_SECONDS,
  BONUS_ONLY_IF_CLEAN,
} from './config';
import { stageForScore, bonusSecondsForStage, isComplete } from './stages';

export const initialState = {
  status: 'idle', // idle | countdown | playing | paused | finished
  level: null,
  countdown: COUNTDOWN_SECONDS,

  word: '',
  index: 0,

  endsAt: null,
  remainingMs: START_SECONDS * 1000, // ginagamit lang kapag paused
  startedAt: null,
  pausedAt: null,
  pausedMs: 0,
  playedMs: 0,

  score: 0,
  correctKeys: 0,
  totalKeys: 0,
  errors: 0,
  wordHadError: false,
  bonusCount: 0,
  completed: false,
};

function finish(state, now) {
  // huwag lumampas sa endsAt kahit nahuli ang rAF
  const end = Math.min(now, state.endsAt);
  return {
    ...state,
    status: 'finished',
    playedMs: Math.max(0, end - state.startedAt - state.pausedMs),
  };
}

function handleKey(state, { key, now, nextWord }) {
  if (state.status !== 'playing') return state;
  if (now >= state.endsAt) return finish(state, now);

  // mali
  if (key !== state.word[state.index]) {
    return {
      ...state,
      totalKeys: state.totalKeys + 1,
      errors: state.errors + 1,
      wordHadError: true,
    };
  }

  // tama
  const next = {
    ...state,
    totalKeys: state.totalKeys + 1,
    correctKeys: state.correctKeys + 1,
    index: state.index + 1,
  };

  if (next.index < state.word.length) return next;

  // natapos ang word
  const bonus = bonusSecondsForStage(stageForScore(state.score));
  let endsAt = state.endsAt;
  let bonusCount = state.bonusCount;
  if (bonus > 0 && (!BONUS_ONLY_IF_CLEAN || !state.wordHadError)) {
    endsAt += bonus * 1000;
    bonusCount += 1;
  }
  if (MAX_SECONDS !== null) {
    endsAt = Math.min(endsAt, now + MAX_SECONDS * 1000);
  }

  const score = state.score + 1;
  const done = {
    ...next,
    score,
    word: nextWord ?? state.word,
    index: 0,
    wordHadError: false,
    endsAt,
    bonusCount,
  };

  // last word of the last stage: the round is complete
  if (isComplete(score)) return { ...finish(done, now), completed: true };
  return done;
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        ...initialState,
        status: 'countdown',
        level: action.level,
        word: action.firstWord,
      };

    case 'COUNTDOWN_TICK':
      if (state.status !== 'countdown') return state;
      return { ...state, countdown: Math.max(0, state.countdown - 1) };

    case 'BEGIN':
      if (state.status !== 'countdown') return state;
      return {
        ...state,
        status: 'playing',
        startedAt: action.now,
        endsAt: action.now + START_SECONDS * 1000,
        remainingMs: START_SECONDS * 1000,
      };

    case 'KEY':
      return handleKey(state, action);

    case 'PAUSE':
      if (state.status !== 'playing') return state;
      return {
        ...state,
        status: 'paused',
        remainingMs: Math.max(0, state.endsAt - action.now),
        pausedAt: action.now,
        endsAt: null,
      };

    case 'RESUME':
      if (state.status !== 'paused') return state;
      return {
        ...state,
        status: 'playing',
        endsAt: action.now + state.remainingMs,
        pausedMs: state.pausedMs + (action.now - state.pausedAt),
        pausedAt: null,
      };

    case 'FINISH':
      if (state.status !== 'playing') return state;
      return finish(state, action.now);

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}