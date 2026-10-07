// components/landing/LeaderboardPreview.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrophyIcon } from '../common/Icons';
import LevelTabs from '../leaderboard/LevelTabs';
import LeaderboardTable from '../leaderboard/LeaderboardTable';
import useLeaderboard from '../../hooks/useLeaderboard';
import styles from './LeaderboardPreview.module.css';

export default function LeaderboardPreview() {
  const [level, setLevel] = useState('medium');
  const { entries, loading } = useLeaderboard(level, 5);

  return (
    <section className={`container ${styles.section}`} aria-labelledby="lb-preview-title">
      <div className={styles.panel}>
        <header className={styles.head}>
          <h2 id="lb-preview-title" className={styles.title}>
            <TrophyIcon /> Top 5 Leaderboard
          </h2>
          <LevelTabs value={level} onChange={setLevel} idPrefix="preview" />
        </header>

        <div id="preview-panel" role="tabpanel" aria-labelledby={`preview-tab-${level}`}>
          <LeaderboardTable level={level} entries={entries} loading={loading} />
        </div>

        <Link to="/leaderboard" className={styles.more}>View full leaderboard →</Link>
      </div>
    </section>
  );
}