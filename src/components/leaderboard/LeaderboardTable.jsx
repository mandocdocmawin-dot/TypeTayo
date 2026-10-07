// components/leaderboard/LeaderboardTable.jsx
// entries: [{ playerName, score, wpm, accuracy }] already sorted (see sortScores in scoring.js)
import { Link } from 'react-router-dom';
import { TrophyIcon } from '../common/Icons';
import styles from './LeaderboardTable.module.css';

export default function LeaderboardTable({ level, entries, loading = false }) {
  if (loading) {
    return <p className={styles.empty} role="status">Loading scores...</p>;
  }

  if (!entries.length) {
    return (
      <div className={styles.empty}>
        <TrophyIcon className={styles.emptyIcon} />
        <p><b>Be the first to set a score!</b></p>
        <Link to={`/play/${level}`} className={styles.cta}>Play {level}</Link>
      </div>
    );
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Player</th>
            <th scope="col">Words</th>
            <th scope="col">WPM</th>
            <th scope="col">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={`${e.playerName}-${e.createdAt ?? i}`}>
              <td>
                <span className={styles.rank} data-rank={i < 3 ? i + 1 : undefined}>{i + 1}</span>
              </td>
              <td className={styles.player}>{e.playerName}</td>
              <td>{e.score}</td>
              <td>{Math.round(e.wpm)}</td>
              <td>{Math.round(e.accuracy)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}