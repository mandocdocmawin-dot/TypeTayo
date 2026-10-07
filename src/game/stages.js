// game/stages.js
// Pure helpers for the Level 1..N progression inside a difficulty.
// "stage" is used in code because `level` already means easy | medium | hard.
import {
  WORDS_PER_STAGE,
  MAX_STAGE,
  NO_BONUS_FROM_STAGE,
  BONUS_SECONDS,
} from './config';

export const TOTAL_WORDS = WORDS_PER_STAGE.reduce((sum, n) => sum + n, 0);

// score = words finished so far. Returns the stage the player is on (1..MAX_STAGE).
export function stageForScore(score) {
  let remaining = score;
  for (let i = 0; i < WORDS_PER_STAGE.length; i++) {
    if (remaining < WORDS_PER_STAGE[i]) return i + 1;
    remaining -= WORDS_PER_STAGE[i];
  }
  return MAX_STAGE;
}

export function bonusSecondsForStage(stage) {
  return stage >= NO_BONUS_FROM_STAGE ? 0 : BONUS_SECONDS;
}

// True once every word of the last stage is done.
export function isComplete(score) {
  return score >= TOTAL_WORDS;
}