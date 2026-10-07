// pages/Static.jsx
// Simple placeholder text for /about, /privacy, /contact. Replace the copy later.
import { Link } from 'react-router-dom';
import styles from './Static.module.css';

const PAGES = {
  about: {
    title: 'About TypeTayo',
    body: [
      'TypeTayo is a free typing game. Pick a level, type each word before the clock runs out, and earn extra seconds for every word you finish.',
      'The on-screen keyboard and hands show which finger to use, so you build good habits while you play.',
    ],
  },
  privacy: {
    title: 'Privacy',
    body: [
      'TypeTayo has no accounts for now. Your name, scores and settings are saved only in your browser.',
      'We do not collect personal data. This page will be updated when online leaderboards are added.',
    ],
  },
  contact: {
    title: 'Contact',
    body: ['Contact details are coming soon.'],
  },
};

export default function Static({ page }) {
  const { title, body } = PAGES[page];
  return (
    <div className={`container ${styles.page}`}>
      <h1>{title}</h1>
      {body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <Link to="/" className={styles.back}>Back to home</Link>
    </div>
  );
}