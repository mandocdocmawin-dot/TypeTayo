// game/scoring.js

// wpm = (correct characters / 5) / minutes actually played
export function calcWpm(correctChars, durationMs) {
  if (durationMs <= 0) return 0;
  const minutes = durationMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

// accuracy = correct keystrokes / total keystrokes * 100 (1 decimal)
export function calcAccuracy(correct, total) {
  if (total <= 0) return 100;
  return Math.round((correct / total) * 1000) / 10;
}

// score desc, wpm desc, accuracy desc, createdAt asc (older first)
export function sortScores(scores) {
  return [...scores].sort(
    (a, b) =>
      b.score - a.score ||
      b.wpm - a.wpm ||
      b.accuracy - a.accuracy ||
      a.createdAt - b.createdAt
  );
}