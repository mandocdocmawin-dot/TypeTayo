// game/scoring.test.js
import { describe, it, expect } from 'vitest';
import { calcWpm, calcAccuracy, sortScores } from './scoring';

describe('calcWpm', () => {
  it('computes wpm from correct chars and duration', () => {
    // 300 chars = 60 words, in 1 minute = 60 wpm
    expect(calcWpm(300, 60000)).toBe(60);
  });
  it('handles partial minutes', () => {
    // 150 chars = 30 words in 30s = 60 wpm
    expect(calcWpm(150, 30000)).toBe(60);
  });
  it('returns 0 when duration is 0', () => {
    expect(calcWpm(50, 0)).toBe(0);
  });
});

describe('calcAccuracy', () => {
  it('computes percentage with 1 decimal', () => {
    expect(calcAccuracy(98, 100)).toBe(98);
    expect(calcAccuracy(1, 3)).toBe(33.3);
  });
  it('returns 100 when there are no keystrokes yet', () => {
    expect(calcAccuracy(0, 0)).toBe(100);
  });
});

describe('sortScores', () => {
  const base = { accuracy: 95, createdAt: 1 };

  it('sorts by score desc', () => {
    const r = sortScores([
      { ...base, score: 10, wpm: 50 },
      { ...base, score: 20, wpm: 40 },
    ]);
    expect(r.map((s) => s.score)).toEqual([20, 10]);
  });

  it('breaks ties by wpm, then accuracy, then older createdAt', () => {
    const r = sortScores([
      { score: 10, wpm: 50, accuracy: 90, createdAt: 1, id: 'a' },
      { score: 10, wpm: 60, accuracy: 80, createdAt: 2, id: 'b' },
      { score: 10, wpm: 60, accuracy: 95, createdAt: 3, id: 'c' },
      { score: 10, wpm: 60, accuracy: 95, createdAt: 2, id: 'd' },
    ]);
    expect(r.map((s) => s.id)).toEqual(['d', 'c', 'b', 'a']);
  });

  it('does not mutate the original array', () => {
    const input = [
      { ...base, score: 1, wpm: 1 },
      { ...base, score: 2, wpm: 1 },
    ];
    sortScores(input);
    expect(input[0].score).toBe(1);
  });
});