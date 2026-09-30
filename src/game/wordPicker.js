// game/wordPicker.js
// Fisher-Yates shuffle (returns a new array)
export function shuffle(words) {
  const a = [...words];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// No repeats until the whole pool is used up, then reshuffle.
export function createPicker(words) {
  if (!words || words.length === 0) {
    throw new Error('createPicker needs at least one word');
  }

  let queue = shuffle(words);
  let last = null;

  return {
    next() {
      if (queue.length === 0) {
        queue = shuffle(words);
        // avoid the same word twice in a row across a reshuffle
        if (queue.length > 1 && queue[0] === last) {
          [queue[0], queue[queue.length - 1]] = [queue[queue.length - 1], queue[0]];
        }
      }
      last = queue.shift();
      return last;
    },
  };
}