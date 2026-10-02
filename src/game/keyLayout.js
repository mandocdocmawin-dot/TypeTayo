// game/keyLayout.js
// US QWERTY layout for the on-screen keyboard, plus a char -> key lookup.
// Key ids: the base character for printable keys ('a', '1', '-'),
// or a name for special keys ('Space', 'ShiftLeft', ...).
// `w` is the key width in units; every row adds up to 15 so the rows line up.

const letter = (ch) => ({ id: ch, label: ch.toUpperCase(), shift: ch.toUpperCase(), top: null, w: 1 });
const symbol = (base, shifted, w = 1) => ({ id: base, label: base, shift: shifted, top: shifted, w });
const special = (id, label, w) => ({ id, label, shift: null, top: null, w });

const letters = (str) => str.split('').map(letter);

export const KEY_ROWS = [
  [
    symbol('`', '~'), symbol('1', '!'), symbol('2', '@'), symbol('3', '#'),
    symbol('4', '$'), symbol('5', '%'), symbol('6', '^'), symbol('7', '&'),
    symbol('8', '*'), symbol('9', '('), symbol('0', ')'), symbol('-', '_'),
    symbol('=', '+'),
    special('Backspace', 'Backspace', 2),
  ],
  [
    special('Tab', 'Tab', 1.5),
    ...letters('qwertyuiop'),
    symbol('[', '{'), symbol(']', '}'), symbol('\\', '|', 1.5),
  ],
  [
    special('CapsLock', 'Caps Lock', 1.75),
    ...letters('asdfghjkl'),
    symbol(';', ':'), symbol("'", '"'),
    special('Enter', 'Enter', 2.25),
  ],
  [
    special('ShiftLeft', 'Shift', 2.25),
    ...letters('zxcvbnm'),
    symbol(',', '<'), symbol('.', '>'), symbol('/', '?'),
    special('ShiftRight', 'Shift', 2.75),
  ],
  [
    special('CtrlLeft', 'Ctrl', 1.75),
    special('AltLeft', 'Alt', 1.75),
    special('Space', '', 8),
    special('AltRight', 'Alt', 1.75),
    special('CtrlRight', 'Ctrl', 1.75),
  ],
];

// char -> { keyId, shift }. `shift` is true when Shift is needed (capitals, !, #, ?, ...).
const CHAR_TO_KEY = new Map();
for (const row of KEY_ROWS) {
  for (const key of row) {
    if (key.id.length === 1) {
      CHAR_TO_KEY.set(key.id, { keyId: key.id, shift: false });
      if (key.shift) CHAR_TO_KEY.set(key.shift, { keyId: key.id, shift: true });
    }
  }
}
CHAR_TO_KEY.set(' ', { keyId: 'Space', shift: false });

export function charToKey(char) {
  return CHAR_TO_KEY.get(char) ?? null;
}