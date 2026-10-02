// game/fingerMap.js
// Which finger presses which key, and what to highlight for a given character.
import { charToKey } from './keyLayout';

// Finger ids match the ids of the paths in the Hands SVG.
export const FINGER_KEYS = {
  'L-pinky': ['`', '1', 'q', 'a', 'z', 'Tab', 'CapsLock', 'ShiftLeft'],
  'L-ring': ['2', 'w', 's', 'x'],
  'L-middle': ['3', 'e', 'd', 'c'],
  'L-index': ['4', '5', 'r', 't', 'f', 'g', 'v', 'b'],
  'R-index': ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'],
  'R-middle': ['8', 'i', 'k', ','],
  'R-ring': ['9', 'o', 'l', '.'],
  'R-pinky': ['0', '-', '=', 'p', '[', ']', ';', "'", '/', '\\', 'Enter', 'Backspace', 'ShiftRight'],
  thumb: ['Space'],
};

const KEY_TO_FINGER = new Map();
for (const [finger, keys] of Object.entries(FINGER_KEYS)) {
  for (const key of keys) KEY_TO_FINGER.set(key, finger);
}

export function fingerForKey(keyId) {
  return KEY_TO_FINGER.get(keyId) ?? null;
}

export function handOf(finger) {
  if (finger?.startsWith('L-')) return 'left';
  if (finger?.startsWith('R-')) return 'right';
  return null;
}

// What the UI should light up for the next character.
// Shift is always pressed by the hand opposite to the finger that types the key.
// Returns null for characters that are not on the keyboard.
export function getHint(char) {
  const hit = charToKey(char);
  if (!hit) return null;

  const finger = fingerForKey(hit.keyId);
  if (!hit.shift) {
    return { keyId: hit.keyId, finger, shiftKeyId: null, shiftFinger: null };
  }

  const shiftKeyId = handOf(finger) === 'left' ? 'ShiftRight' : 'ShiftLeft';
  return { keyId: hit.keyId, finger, shiftKeyId, shiftFinger: fingerForKey(shiftKeyId) };
}