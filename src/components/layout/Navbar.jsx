// components/layout/Navbar.jsx
// No Login / Sign up yet. TODO: add them when accounts are built (README Section 13).
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Logo height={52} />
        <nav className={styles.links} aria-label="Main">
          {/* Layout scrolls to #how-it-works when the hash is present */}
          <Link to="/#how-it-works" className={styles.link}>How to Play</Link>
          <Link to="/leaderboard" className={styles.link}>Leaderboard</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}