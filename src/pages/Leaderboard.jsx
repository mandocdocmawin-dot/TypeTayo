// pages/Leaderboard.jsx
import { useState } from 'react';
import LevelTabs from '../components/leaderboard/LevelTabs';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import useLeaderboard from '../hooks/useLeaderboard';
import styles from './Leaderboard.module.css';

export default function Leaderboard() {
  const [level, setLevel] = useState('medium');
  const { entries, loading } = useLeaderboard(level, 10);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Leaderboard</h1>
      <p className={styles.sub}>Ranked by words completed, then WPM, then accuracy.</p>
      <LevelTabs value={level} onChange={setLevel} idPrefix="lb" />
      <div id="lb-panel" role="tabpanel" aria-labelledby={`lb-tab-${level}`} className={styles.panel}>
        <LeaderboardTable level={level} entries={entries} loading={loading} />
      </div>
    </div>
  );
}