// components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Logo height={32} />
        <p className={styles.made}>
          <span aria-hidden="true">♥</span> Made with love in the Philippines
        </p>
        <nav className={styles.links} aria-label="Footer">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}