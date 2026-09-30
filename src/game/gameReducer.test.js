import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from './gameReducer';
import { START_SECONDS, BONUS_SECONDS, COUNTDOWN_SECONDS } from './config';

const run = (state, ...actions) => actions.reduce(gameReducer, state);

// nasa "playing" na, nagsimula sa now = 1000
const playing = (word = 'ab') =>
  run(
    initialState,
    { type: 'START', level: 'easy', firstWord: word },
    { type: 'BEGIN', now: 1000 }
  );

describe('start flow', () => {
  it('START goes to countdown with level and first word', () => {
    const s = run(initialState, { type: 'START', level: 'medium', firstWord: 'planet' });
    expect(s.status).toBe('countdown');
    expect(s.level).toBe('medium');
    expect(s.word).toBe('planet');
    expect(s.countdown).toBe(COUNTDOWN_SECONDS);
  });

  it('COUNTDOWN_TICK decrements and never goes below 0', () => {
    let s = run(initialState, { type: 'START', level: 'easy', firstWord: 'sad' });
    for (let i = 0; i < COUNTDOWN_SECONDS + 2; i++) {
      s = gameReducer(s, { type: 'COUNTDOWN_TICK' });
    }
    expect(s.countdown).toBe(0);
  });

  it('BEGIN starts the clock', () => {
    const s = playing();
    expect(s.status).toBe('playing');
    expect(s.startedAt).toBe(1000);
    expect(s.endsAt).toBe(1000 + START_SECONDS * 1000);
  });
});

describe('typing', () => {
  it('correct key advances the index', () => {
    const s = run(playing('ab'), { type: 'KEY', key: 'a', now: 2000 });
    expect(s.index).toBe(1);
    expect(s.correctKeys).toBe(1);
    expect(s.totalKeys).toBe(1);
    expect(s.errors).toBe(0);
  });

  it('wrong key does not advance and counts an error', () => {
    const s = run(playing('ab'), { type: 'KEY', key: 'x', now: 2000 });
    expect(s.index).toBe(0);
    expect(s.errors).toBe(1);
    expect(s.totalKeys).toBe(1);
    expect(s.correctKeys).toBe(0);
    expect(s.wordHadError).toBe(true);
  });

  it('completing a word gives score, bonus time, and the next word', () => {
    const before = playing('ab');
    const s = run(
      before,
      { type: 'KEY', key: 'a', now: 2000 },
      { type: 'KEY', key: 'b', now: 3000, nextWord: 'cd' }
    );
    expect(s.score).toBe(1);
    expect(s.word).toBe('cd');
    expect(s.index).toBe(0);
    expect(s.bonusCount).toBe(1);
    expect(s.endsAt).toBe(before.endsAt + BONUS_SECONDS * 1000);
  });

  it('ignores keys when not playing', () => {
    const s = run(initialState, { type: 'KEY', key: 'a', now: 1 });
    expect(s).toBe(initialState);
  });

  it('a key after endsAt finishes the game instead', () => {
    const s = playing('ab');
    const out = gameReducer(s, { type: 'KEY', key: 'a', now: s.endsAt });
    expect(out.status).toBe('finished');
    expect(out.correctKeys).toBe(0);
  });
});

describe('pause and finish', () => {
  it('PAUSE saves remaining time and RESUME restores the clock', () => {
    let s = run(playing(), { type: 'PAUSE', now: 11000 });
    expect(s.status).toBe('paused');
    expect(s.remainingMs).toBe(20000);
    expect(s.endsAt).toBe(null);

    s = gameReducer(s, { type: 'RESUME', now: 15000 });
    expect(s.status).toBe('playing');
    expect(s.endsAt).toBe(35000);
  });

  it('FINISH computes playedMs without the paused time', () => {
    const s = run(
      playing(),
      { type: 'PAUSE', now: 11000 },
      { type: 'RESUME', now: 15000 },
      { type: 'FINISH', now: 40000 } // huli ang rAF, nakalampas na sa endsAt (35000)
    );
    expect(s.status).toBe('finished');
    expect(s.playedMs).toBe(30000);
  });

  it('RESET goes back to the initial state', () => {
    const s = run(playing(), { type: 'RESET' });
    expect(s).toEqual(initialState);
  });
});