// data/words/medium.js
// One pool per stage (Level 1..5). Letters, capitals, numbers and spaces.
// No symbols. 16 characters max. A space never comes right after a character
// that needs Shift (Shift + Space is Start/Pause in the Play page).
//   Level 1: Capitalized 5-letter word + 1 digit        (Apple2)
//   Level 2: Capitalized 6-letter word + 2 digits       (Bridge11)
//   Level 3: Two words with a space + digits            (Fat Finger11)
//   Level 4: Three words with spaces + digits           (Big Red Fox27)
//   Level 5: Three words, digits after the first too    (Sun2 Moon Star26)
const medium = {
  1: [
    'Apple2', 'Lemon5', 'Ocean8', 'Quiet2', 'River5', 'Orbit8', 'Bread2',
    'Chair5', 'Dream8', 'Eagle2', 'Flame5', 'Grape8', 'Horse2', 'Juice5',
    'Light8', 'Money2', 'Night5', 'Paper8', 'Queen2', 'Radio5', 'Stone8',
    'Table2', 'Uncle5', 'Water8', 'Young2', 'Plant5', 'Cloud8', 'Beach2',
    'Smile5', 'Tiger8', 'Music2',
  ],
  2: [
    'Bridge11', 'Candle48', 'Dragon85', 'Engine22', 'Forest59', 'Garden96',
    'Hammer33', 'Island70', 'Jungle07', 'Ladder44', 'Market81', 'Number18',
    'Orange55', 'Planet92', 'Rocket29', 'Silver66', 'Tunnel03', 'Valley40',
    'Window77', 'Yellow14', 'Anchor51', 'Basket88', 'Camera25', 'Desert62',
    'Eleven99', 'Flower36', 'Guitar73', 'Helmet10', 'Insect47', 'Jacket84',
    'Kettle21', 'Mirror58', 'Nature95', 'Pencil32', 'School69', 'Turtle06',
    'Unique43', 'Violin80', 'Winter17', 'Pocket54', 'Button91', 'Carpet28',
    'Coffee65', 'Doctor02', 'Energy39', 'Family76',
  ],
  3: [
    'Fat Finger11', 'Red Apple7', 'Big Boss23', 'Hot Coffee5', 'Cold Water9',
    'Blue Sky18', 'Fast Car42', 'Sweet Tea6', 'Good Day10', 'Old Man77',
    'New Phone3', 'Dark Night8', 'Cool Cat21', 'Lucky Star7', 'Happy Dog4',
    'Green Tree15', 'Pink Rose2', 'Sunny Day31', 'Warm Rice9', 'Tall Girl5',
    'Iron Man12', 'Gold Fish3', 'Ice Cream88', 'Hot Dog24', 'Big Bang1',
  ],
  4: [
    'Big Red Fox27', 'Old Blue Car5', 'Tiny Red Ant8', 'The Big Day21',
    'Our Best Day12', 'One Fine Day7', 'Two Big Cats2', 'Red Hot Chili6',
    'Big Fat Cat88', 'Sad Old Dog4', 'Top Ten Tips10', 'Hot Cold Tea5',
    'Fun Time Now9', 'New Year Day1', 'Sun Moon Star3', 'Big Blue Sea6',
    'Hot Sweet Tea3', 'Old Gold Ring5', 'Red Rose Day14',
  ],
  5: [
    'Sun2 Moon Star26', 'Big7 Red Fox99', 'Red9 Hot Pot12', 'Old3 Blue Car5',
    'Hot5 Fresh Tea8', 'Fat1 Cat Dog22', 'Big4 Bad Wolf7', 'Ice8 Cold Tea3',
    'One1 Fine Day7', 'Top1 Gun Fan84', 'Sky5 Blue Sea9', 'Mom2 Dad Kid3',
    'Hot4 Dog Man1', 'Red7 Rose Day8', 'Old6 Man Joe5', 'New3 Year Day1',
    'Fun9 Time Now2', 'Big3 Sad Day11', 'Sun2 Rice Cup12',
  ],
};

export default medium;