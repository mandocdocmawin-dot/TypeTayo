// game/fingerColors.js
// Maps a finger id ('L-pinky', 'R-index', 'thumb') to its CSS color variable.
import { fingerForKey } from './fingerMap';
import { charToKey } from './keyLayout';

const FINGER_TO_VAR = {
  pinky: 'var(--finger-pinky)',
  ring: 'var(--finger-ring)',
  middle: 'var(--finger-middle)',
  index: 'var(--finger-index)',
  thumb: 'var(--finger-thumb)',
};

export function fingerColor(finger) {
  if (!finger) return null;
  const name = finger === 'thumb' ? 'thumb' : finger.slice(2); // 'L-pinky' -> 'pinky'
  return FINGER_TO_VAR[name] ?? null;
}

// Color for a typed character; null if the character is not on the keyboard.
export function colorForChar(char) {
  const hit = charToKey(char);
  return hit ? fingerColor(fingerForKey(hit.keyId)) : null;
}