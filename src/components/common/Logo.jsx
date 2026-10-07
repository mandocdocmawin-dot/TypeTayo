// components/common/Logo.jsx
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './Logo.module.css';

export default function Logo({ height = 40 }) {
  return (
    <Link to="/" className={styles.logo} aria-label="TypeTayo home">
      <img src={logo} alt="TypeTayo" style={{ height }} />
    </Link>
  );
}