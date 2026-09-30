// game/wordPicker.test.js
import { describe, it, expect } from 'vitest';
import { createPicker, shuffle } from './wordPicker';

const pool = ['a', 'b', 'c', 'd', 'e'];

describe('shuffle', () => {
  it('keeps the same items and does not mutate the input', () => {
    const input = [...pool];
    const out = shuffle(input);
    expect(input).toEqual(pool);
    expect([...out].sort()).toEqual(pool);
  });
});

describe('createPicker', () => {
  it('does not repeat until the pool is used up', () => {
    const picker = createPicker(pool);
    const firstRound = pool.map(() => picker.next());
    expect(new Set(firstRound).size).toBe(pool.length);
  });

  it('keeps going after the pool is exhausted', () => {
    const picker = createPicker(pool);
    const words = Array.from({ length: pool.length * 3 }, () => picker.next());
    words.forEach((w) => expect(pool).toContain(w));
  });

  it('never gives the same word twice in a row', () => {
    const picker = createPicker(pool);
    let prev = picker.next();
    for (let i = 0; i < 200; i++) {
      const w = picker.next();
      expect(w).not.toBe(prev);
      prev = w;
    }
  });

  it('works with a single word', () => {
    const picker = createPicker(['only']);
    expect(picker.next()).toBe('only');
    expect(picker.next()).toBe('only');
  });

  it('throws on an empty pool', () => {
    expect(() => createPicker([])).toThrow();
  });
});