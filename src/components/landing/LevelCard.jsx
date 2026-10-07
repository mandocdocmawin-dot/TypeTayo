// components/landing/LevelCard.jsx
import { Link } from 'react-router-dom';
import { ClockIcon, TrophyIcon, PlayIcon } from '../common/Icons';
import { START_SECONDS, BONUS_SECONDS } from '../../game/config';
import styles from './LevelCard.module.css';

// previewIndex = how many letters of the preview word already look "typed"
export default function LevelCard({ level, title, tag, description, preview, previewIndex, best = null }) {
  return (
    <article className={styles.card} data-level={level}>
      <header className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.tag}>{tag}</span>
      </header>

      <p className={styles.desc}>{description}</p>

      <div className={`${styles.preview} mono`} aria-hidden="true">
        {[...preview].map((ch, i) => (
          <span
            key={i}
            className={styles.tile}
            data-state={i < previewIndex ? 'typed' : i === previewIndex ? 'current' : 'upcoming'}
          >
            {ch}
          </span>
        ))}
      </div>

      <ul className={styles.facts}>
        <li><ClockIcon /> {START_SECONDS}s + {BONUS_SECONDS}s per word</li>
        <li><TrophyIcon /> Personal best: {best ?? '--'}</li>
      </ul>

      <Link to={`/play/${level}`} className={styles.play} aria-label={`Play ${title}`}>
        <PlayIcon /> Play
      </Link>
    </article>
  );
}