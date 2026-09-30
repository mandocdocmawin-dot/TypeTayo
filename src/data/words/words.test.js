// data/words/words.test.js
import { describe, it, expect } from 'vitest';
import easy from './easy';
import medium from './medium';
import hard from './hard';

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

describe('medium word list', () => {
  it('has at least 100 words', () => {
    expect(medium.length).toBeGreaterThanOrEqual(100);
  });

  it('is 5-9 lowercase letters only', () => {
    const bad = medium.filter((w) => !/^[a-z]{5,9}$/.test(w));
    expect(bad).toEqual([]);
  });

  it('has no duplicates', () => {
    expect(new Set(medium).size).toBe(medium.length);
  });
});

describe('hard word list', () => {
  it('has at least 80 entries', () => {
    expect(hard.length).toBeGreaterThanOrEqual(80);
  });

  it('is printable ASCII with no spaces', () => {
    const bad = hard.filter((w) => !/^[\x21-\x7E]+$/.test(w));
    expect(bad).toEqual([]);
  });

  it('every entry has a capital, number, or symbol', () => {
    const bad = hard.filter((w) => !/[A-Z0-9\W_]/.test(w));
    expect(bad).toEqual([]);
  });

  it('has no duplicates', () => {
    expect(new Set(hard).size).toBe(hard.length);
  });
});