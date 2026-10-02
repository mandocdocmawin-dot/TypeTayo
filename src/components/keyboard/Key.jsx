// components/keyboard/Key.jsx
import styles from './Key.module.css';

export default function Key({ keyDef, active }) {
  const { label, top, w } = keyDef;
  const cls = [styles.cap, active ? styles.active : '', label.length > 1 ? styles.special : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.slot} style={{ '--w': w }}>
      <div className={cls}>
        {top && active && <span className={styles.top}>{top}</span>}
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}