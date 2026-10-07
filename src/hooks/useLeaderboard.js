// hooks/useLeaderboard.js
// PLACEHOLDER until Phase 4. Returns no entries, so the UI shows the empty state
// ("Be the first to set a score!"). No fake scores, as the README says.
//
// TODO (Phase 4): replace the body with
//   const rows = await api.getLeaderboard(level, limit)   // from src/api
// and keep the same return shape: { entries, loading }.
export default function useLeaderboard(level, limit = 5) {
  void level;
  void limit;
  return { entries: [], loading: false };
}