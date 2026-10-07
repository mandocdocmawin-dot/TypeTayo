// data/words/easy.js
// One pool per stage (Level 1..5). Lowercase, 3-5 letters.
//   Level 1: home row only (asdfghjkl)
//   Level 2: + e i r u
//   Level 3: + the whole top row (qwertyuiop)
//   Level 4: all letters, at least one bottom-row letter (zxcvbnm)
//   Level 5: all letters, exactly 5 letters
const easy = {
  1: [
    'add', 'ads', 'all', 'ash', 'ask', 'dad', 'fad', 'gal', 'gas', 'had',
    'has', 'lad', 'lag', 'sad', 'sag',
    'adds', 'alas', 'dash', 'fall', 'flag', 'glad', 'half', 'hall', 'hash',
    'lads', 'lass', 'sags',
    'falls', 'flash', 'flask', 'glass', 'halls', 'salad', 'salsa', 'shall',
    'slash',
  ],
  2: [
    'red', 'her', 'use', 'sir', 'ski', 'lie', 'die', 'hid', 'kid', 'lid',
    'fur', 'fir', 'far', 'jar', 'jug', 'sue', 'due', 'rug', 'hug', 'rid',
    'ear', 'era', 'age', 'ale', 'elk',
    'dare', 'fear', 'hear', 'lake', 'hide', 'ride', 'side', 'sure', 'lure',
    'rule', 'rude', 'dual', 'gale', 'glue', 'huge', 'hire', 'sled', 'shed',
    'lies', 'leaf',
    'ladle', 'rules', 'dried', 'sugar', 'ideal', 'fresh', 'usual', 'hairs',
    'ruler', 'ridge', 'hired', 'laser', 'glare', 'shake', 'share', 'risks',
    'flush',
  ],
  3: [
    'top', 'toy', 'you', 'out', 'pot', 'pet', 'pit', 'put', 'wet', 'who',
    'why', 'was', 'saw', 'say', 'sky', 'tea', 'ate', 'the', 'hot', 'hit',
    'hat', 'two', 'pay', 'key', 'yes', 'joy', 'toe', 'too', 'row', 'low',
    'owl', 'oil', 'pie', 'tie',
    'this', 'that', 'what', 'with', 'they', 'your', 'tour', 'post', 'port',
    'pure', 'quit', 'pass', 'play', 'paid', 'wait', 'wire', 'wild',
    'tough', 'towel', 'quiet', 'equal', 'quote', 'pause', 'spoke', 'house',
    'hoist', 'paste', 'waste', 'trust', 'write', 'sleep', 'tight', 'query',
  ],
  4: [
    'man', 'can', 'van', 'bad', 'cab', 'box', 'zip', 'zoo', 'mix', 'fix',
    'six', 'bus', 'buy', 'jam', 'ham', 'nap', 'new', 'now', 'not', 'gum',
    'name', 'came', 'make', 'move', 'vase', 'join', 'junk', 'fund', 'bond',
    'jump', 'lamp', 'nice', 'mice', 'cave', 'five', 'zero', 'zone', 'back',
    'lazy',
    'voice', 'black', 'brown', 'maybe', 'never', 'mixed', 'quick', 'beach',
    'bench', 'candy', 'dance', 'movie', 'music', 'honey',
  ],
  5: [
    'jumpy', 'lunch', 'vowel', 'thumb', 'mango', 'climb', 'brave', 'crown',
    'dozen', 'exact', 'fixed', 'nerve', 'ozone', 'plumb', 'rhyme', 'shrub',
    'swamp', 'twist', 'vivid', 'waltz', 'woman', 'yacht', 'zesty', 'jazzy',
    'fuzzy', 'zebra',
  ],
};

export default easy;