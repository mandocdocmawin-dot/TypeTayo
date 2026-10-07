// game/fingerMap.test.js
import { describe, it, expect } from 'vitest';
import { KEY_ROWS, charToKey } from './keyLayout';
import { FINGER_KEYS, fingerForKey, getHint } from './fingerMap';
import easy from '../data/words/easy';
import medium from '../data/words/medium';
import hard from '../data/words/hard';

describe('keyLayout', () => {
  it('every row is 15 units wide', () => {
    for (const row of KEY_ROWS) {
      expect(row.reduce((sum, k) => sum + k.w, 0)).toBe(15);
    }
  });

  it('has no duplicate key ids', () => {
    const ids = KEY_ROWS.flat().map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('maps characters to keys', () => {
    expect(charToKey('a')).toEqual({ keyId: 'a', shift: false });
    expect(charToKey('A')).toEqual({ keyId: 'a', shift: true });
    expect(charToKey('#')).toEqual({ keyId: '3', shift: true });
    expect(charToKey('?')).toEqual({ keyId: '/', shift: true });
    expect(charToKey(' ')).toEqual({ keyId: 'Space', shift: false });
    expect(charToKey('é')).toBeNull();
  });
});

describe('fingerMap', () => {
  it('follows the finger table', () => {
    expect(fingerForKey('q')).toBe('L-pinky');
    expect(fingerForKey('w')).toBe('L-ring');
    expect(fingerForKey('d')).toBe('L-middle');
    expect(fingerForKey('g')).toBe('L-index');
    expect(fingerForKey('h')).toBe('R-index');
    expect(fingerForKey(',')).toBe('R-middle');
    expect(fingerForKey('l')).toBe('R-ring');
    expect(fingerForKey("'")).toBe('R-pinky');
    expect(fingerForKey('Space')).toBe('thumb');
  });

  it('gives every printable key a finger', () => {
    const printable = KEY_ROWS.flat().filter((k) => k.id.length === 1 || k.id === 'Space');
    const missing = printable.filter((k) => !fingerForKey(k.id)).map((k) => k.id);
    expect(missing).toEqual([]);
  });

  it('does not assign a key to two fingers', () => {
    const all = Object.values(FINGER_KEYS).flat();
    expect(new Set(all).size).toBe(all.length);
  });

  it('lowercase letters need no Shift', () => {
    expect(getHint('f')).toEqual({ keyId: 'f', finger: 'L-index', shiftKeyId: null, shiftFinger: null });
  });

  it('shifted symbols use the finger of their base key', () => {
    expect(getHint('#').finger).toBe('L-middle'); // 3
    expect(getHint('!').finger).toBe('L-pinky'); // 1
    expect(getHint('?').finger).toBe('R-pinky'); // /
    expect(getHint('&').finger).toBe('R-index'); // 7
  });

  it('presses Shift with the opposite hand', () => {
    // left-hand key -> right Shift (right pinky)
    expect(getHint('A')).toMatchObject({ keyId: 'a', shiftKeyId: 'ShiftRight', shiftFinger: 'R-pinky' });
    expect(getHint('#')).toMatchObject({ shiftKeyId: 'ShiftRight', shiftFinger: 'R-pinky' });
    // right-hand key -> left Shift (left pinky)
    expect(getHint('P')).toMatchObject({ keyId: 'p', shiftKeyId: 'ShiftLeft', shiftFinger: 'L-pinky' });
    expect(getHint('?')).toMatchObject({ shiftKeyId: 'ShiftLeft', shiftFinger: 'L-pinky' });
    expect(getHint('"')).toMatchObject({ keyId: "'", shiftKeyId: 'ShiftLeft' });
  });

  it('returns null for characters that are not on the keyboard', () => {
    expect(getHint('é')).toBeNull();
    expect(getHint(undefined)).toBeNull();
  });

  it('covers every character in every word list', () => {
    const words = [easy, medium, hard].flatMap((lists) => Object.values(lists).flat());
    const chars = new Set(words.join('').split(''));
    const bad = [...chars].filter((c) => {
      const h = getHint(c);
      return !h || !h.keyId || !h.finger || (h.shiftKeyId && !h.shiftFinger);
    });
    expect(bad).toEqual([]);
  });
});