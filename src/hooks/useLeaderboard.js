// hooks/useLeaderboard.js
// TEMPORARY: mock data ang ibinabalik. Papalitan ng api adapter sa Phase 4.
import { useMemo } from 'react';
import { MOCK_LEADERBOARD } from '../data/mockLeaderboard';

export default function useLeaderboard(level, limit = 5) {
  const entries = useMemo(
    () => (MOCK_LEADERBOARD[level] ?? []).slice(0, limit),
    [level, limit]
  );

  return { entries, loading: false };
}