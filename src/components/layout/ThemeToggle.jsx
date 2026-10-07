// components/layout/ThemeToggle.jsx
import useTheme from '../../hooks/useTheme';
import { SunIcon, MoonIcon } from '../common/Icons';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Light theme"
      className={styles.toggle}
      data-theme-state={theme}
      onClick={toggle}
    >
      <span className={styles.thumb} aria-hidden="true" />
      <span className={styles.icon} data-on={isLight}><SunIcon /></span>
      <span className={styles.icon} data-on={!isLight}><MoonIcon /></span>
    </button>
  );
}