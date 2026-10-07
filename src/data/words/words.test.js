// data/words/words.test.js
import { describe, it, expect } from 'vitest';
import easy from './easy';
import medium from './medium';
import hard from './hard';
import { WORDS_PER_STAGE, MAX_STAGE } from '../../game/config';
import { charToKey } from '../../game/keyLayout';

const STAGES = Array.from({ length: MAX_STAGE }, (_, i) => i + 1);
const flat = (lists) => Object.values(lists).flat();
const countSymbols = (w) => (w.match(/[^A-Za-z0-9 ]/g) ?? []).length;
const countSpaces = (w) => (w.match(/ /g) ?? []).length;
const MAX_LENGTH = 16; // longest word the WordBox can show

// Shift + Space is Start/Pause in the Play page, so a space must not come
// right after a character that needs Shift (capitals, !, %, $, ...).
const spaceAfterShift = (w) =>
  [...w].some((ch, i) => ch === ' ' && i > 0 && charToKey(w[i - 1])?.shift);

// Every stage needs enough words for a whole stage without a repeat.
function sharedChecks(name, lists) {
  describe(`${name}: shape`, () => {
    it('has one pool for every stage and nothing else', () => {
      expect(Object.keys(lists).map(Number)).toEqual(STAGES);
    });

    it.each(STAGES)('stage %i has enough words for the whole stage', (stage) => {
      expect(lists[stage].length).toBeGreaterThanOrEqual(WORDS_PER_STAGE[stage - 1]);
    });

    it('has no duplicates inside a stage or across stages', () => {
      const all = flat(lists);
      expect(new Set(all).size).toBe(all.length);
    });
  });
}

describe('easy word lists', () => {
  sharedChecks('easy', easy);

  const HOME = 'asdfghjkl';
  const TOP = 'qwertyuiop';
  const BOTTOM = 'zxcvbnm';
  const ALLOWED = {
    1: HOME,
    2: HOME + 'eiru',
    3: HOME + TOP,
    4: HOME + TOP + BOTTOM,
    5: HOME + TOP + BOTTOM,
  };
  // letters a stage must introduce (every word uses at least one of them)
  const NEW_LETTERS = {
    2: 'eiru',
    3: 'qwtyop',
    4: BOTTOM,
  };

  it.each(STAGES)('stage %i only uses its allowed letters', (stage) => {
    const re = new RegExp(`^[${ALLOWED[stage]}]+$`);
    expect(easy[stage].filter((w) => !re.test(w))).toEqual([]);
  });

  it.each([2, 3, 4])('stage %i words each use a newly added letter', (stage) => {
    const re = new RegExp(`[${NEW_LETTERS[stage]}]`);
    expect(easy[stage].filter((w) => !re.test(w))).toEqual([]);
  });

  it('is 3-5 letters long', () => {
    expect(flat(easy).filter((w) => !/^[a-z]{3,5}$/.test(w))).toEqual([]);
  });

  it('stage 5 words are exactly 5 letters', () => {
    expect(easy[5].filter((w) => w.length !== 5)).toEqual([]);
  });
});

describe('medium word lists', () => {
  sharedChecks('medium', medium);

  // Letters, capitals, numbers and spaces. Each stage has its own shape.
  const SHAPE = {
    1: /^[A-Z][a-z]{4}\d$/, // Apple2
    2: /^[A-Z][a-z]{5}\d{2}$/, // Bridge11
    3: /^[A-Z][a-z]{2,5} [A-Z][a-z]{2,5}\d{1,2}$/, // Fat Finger11
    4: /^[A-Z][a-z]{2,4} [A-Z][a-z]{2,4} [A-Z][a-z]{2,5}\d{1,2}$/, // Big Red Fox27
    5: /^[A-Z][a-z]{2,4}\d{1,2} [A-Z][a-z]{2,4} [A-Z][a-z]{2,4}\d{1,3}$/, // Sun2 Moon Star26
  };
  const SPACES = { 1: 0, 2: 0, 3: 1, 4: 2, 5: 2 };

  it('uses only letters, numbers and spaces (no symbols)', () => {
    expect(flat(medium).filter((w) => !/^[A-Za-z0-9 ]+$/.test(w))).toEqual([]);
  });

  it('every word has a capital and a number', () => {
    expect(flat(medium).filter((w) => !/[A-Z]/.test(w) || !/\d/.test(w))).toEqual([]);
  });

  it.each(STAGES)('stage %i words follow the stage shape', (stage) => {
    expect(medium[stage].filter((w) => !SHAPE[stage].test(w))).toEqual([]);
  });

  it.each(STAGES)('stage %i has the right number of spaces', (stage) => {
    expect(medium[stage].filter((w) => countSpaces(w) !== SPACES[stage])).toEqual([]);
  });

  it(`fits on screen (${MAX_LENGTH} characters max)`, () => {
    expect(flat(medium).filter((w) => w.length > MAX_LENGTH)).toEqual([]);
  });

  it('never puts a space right after a Shift character', () => {
    expect(flat(medium).filter(spaceAfterShift)).toEqual([]);
  });
});

describe('hard word lists', () => {
  sharedChecks('hard', hard);

  // [min, max] symbols per stage: they go up as the stage goes up (spaces do not count)
  const SYMBOLS = { 1: [1, 1], 2: [2, 2], 3: [3, 3], 4: [4, 4], 5: [5, Infinity] };
  // [min, max] spaces per stage: none in stage 1, then 1-2
  const SPACES = { 1: [0, 0], 2: [1, 2], 3: [1, 2], 4: [1, 2], 5: [1, 2] };

  it('is printable ASCII, with single spaces only between characters', () => {
    const bad = flat(hard).filter(
      (w) => !/^[\x20-\x7E]+$/.test(w) || w !== w.trim() || w.includes('  ')
    );
    expect(bad).toEqual([]);
  });

  it(`fits on screen (${MAX_LENGTH} characters max)`, () => {
    expect(flat(hard).filter((w) => w.length > MAX_LENGTH)).toEqual([]);
  });

  it('every entry has a capital, a number and a symbol', () => {
    const bad = flat(hard).filter(
      (w) => !/[A-Z]/.test(w) || !/\d/.test(w) || countSymbols(w) === 0
    );
    expect(bad).toEqual([]);
  });

  it.each(STAGES)('stage %i has the right number of symbols', (stage) => {
    const [min, max] = SYMBOLS[stage];
    const bad = hard[stage].filter((w) => {
      const n = countSymbols(w);
      return n < min || n > max;
    });
    expect(bad).toEqual([]);
  });

  it.each(STAGES)('stage %i has the right number of spaces', (stage) => {
    const [min, max] = SPACES[stage];
    const bad = hard[stage].filter((w) => {
      const n = countSpaces(w);
      return n < min || n > max;
    });
    expect(bad).toEqual([]);
  });

  it('never puts a space right after a Shift character', () => {
    expect(flat(hard).filter(spaceAfterShift)).toEqual([]);
  });
});