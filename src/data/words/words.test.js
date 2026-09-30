// data/words/words.test.js
import { describe, it, expect } from 'vitest';
import easy from './easy';

describe('easy word list', () => {
  it('has 60-100 words', () => {
    expect(easy.length).toBeGreaterThanOrEqual(60);
    expect(easy.length).toBeLessThanOrEqual(100);
  });

  it('uses only home row letters and is 3-5 letters long', () => {
    const bad = easy.filter((w) => !/^[asdfghjkl]{3,5}$/.test(w));
    expect(bad).toEqual([]);
  });

  it('has no duplicates', () => {
    expect(new Set(easy).size).toBe(easy.length);
  });
});

// TODO: add medium (5-9 lowercase letters, 100+) and hard (80+, printable ASCII, no spaces)
// once medium.js and hard.js are filled in.