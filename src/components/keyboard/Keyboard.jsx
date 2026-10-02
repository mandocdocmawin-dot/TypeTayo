// components/keyboard/Keyboard.jsx
// Full QWERTY. Only `activeKey` glows, plus `shiftKey` when a capital or symbol needs Shift.
// Pass <Hands /> as children to draw the hands on top of the keys. `belowUnits` reserves
// that much space under the keys (in key-units) so the hands do not overlap the next section.
import { KEY_ROWS } from '../../game/keyLayout';
import Key from './Key';
import { KeyboardContext } from './KeyboardContext';
import styles from './Keyboard.module.css';

export default function Keyboard({ activeKey = null, shiftKey = null, belowUnits = 0, children = null }) {
  return (
    <div
      className={styles.keyboard}
      role="img"
      aria-label="On-screen keyboard. The next key to press is highlighted."
    >
      {KEY_ROWS.map((row, r) => (
        <div className={styles.row} key={r}>
          {row.map((keyDef) => (
            <Key
              key={keyDef.id}
              keyDef={keyDef}
              active={keyDef.id === activeKey || keyDef.id === shiftKey}
            />
          ))}
        </div>
      ))}
      {belowUnits > 0 && (
        <div className={styles.below} style={{ '--below': belowUnits }} aria-hidden="true" />
      )}
      <KeyboardContext.Provider value={{ activeKey, shiftKey }}>{children}</KeyboardContext.Provider>
    </div>
  );
}