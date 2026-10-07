// data/words/hard.js
// One pool per stage (Level 1..5). Printable ASCII, 16 characters max.
// Everyday things that anyone has typed or seen: passwords, emails, prices,
// times, dates, and phrases with punctuation. No programmer words.
// Every word has a capital, a number AND a symbol (anything that is not a
// letter, digit or space). The number of symbols goes up with the stage:
//   Level 1: 1 symbol    Level 2: 2 symbols    Level 3: 3 symbols
//   Level 4: 4 symbols   Level 5: 5 or more symbols
// Spaces: none in Level 1, then 1-2 spaces from Level 2 on.
// A space never comes right after a character that needs Shift (capital,
// !, %, $, ...), because Shift + Space is Start/Pause in the Play page.
const hard = {
  1: [
    'Hello123!', 'Pass@123', 'Juan_Cruz21', 'Mama#1', 'Love_You2', 'Sale50%',
    'Mom&Dad4', 'Pizza#1', 'Rank#1', 'Price$99', 'Wifi#2026', 'Happy2026!',
    'Welcome1!', 'Salamat#1', 'Mabuhay!7', 'Cake_4U', 'Best_Day1',
    'Coffee&Tea2', 'Tara_Na7', 'Pogi#1', 'Maria_05', 'Birthday#7',
    'Merry#Xmas25', 'Free$100',
  ],
  2: [
    'Love You_2!', 'Sale 50%!', 'Top 10%!', 'Call Me@7!', 'Wi-Fi 5G#1',
    'Time 7:30-8PM', 'Meet@7:30 PM', 'Price $9.99', 'Total $1,500',
    'Pay $5.00', 'Happy Day#7!', 'Hello World_1!', 'Follow Me@1!',
    'Order #123!', 'Ate Bea@21!', 'Oct-07 2026!', 'Room 12-B!', 'Gate 7/B!',
    'Bus No.5!',
  ],
  3: [
    'Sale $50 Off!!', 'Call Me@7:30!', 'Total $1,500.00', 'Pay $5.00 Now!',
    'Love You#2!!', 'Oct-07 2026!!', 'Buy 1-Get 1!!', 'Thanks a Lot#1!!',
    'See you@8PM!!', 'Win $100 Now!!', 'Mom, Dad#1!', 'Hello, World_1!',
    'Yes, 100%!', 'Oct 07, 2026!!',
  ],
  4: [
    'P@$$w0rd 123!', 'Buy $9.99-Now!', 'Sale -50%Off!!', 'Meet Me@7:30-8!',
    'Total $1,500.00!', 'Hello, World_1!!', 'Mom, Dad@Home#1!',
    'Win $100-Now!!', 'See you@8PM!!!', 'Pay $5.00-Now!', 'Oct 07, 2026!!!',
    'Love You#2!!!', 'Wi-Fi 5G_#1!', 'Yes, 100%, OK!', 'Hi, Mom-Dad#1!',
    'Call Me@7:30!!',
  ],
  5: [
    'Love You#2!!!!', 'Oct 07, 2026!!!!', 'Sale $20-Off!!!', 'Top 10%-Off!!!',
    'Yes, 100%, OK!!', 'Call Me@7:30-8!!', 'Hi, Mom-Dad#1!!',
    'Pay $1,500.00!!', 'P@$$w0rd 123!#', 'Win $100-Now!!!', 'Wi-Fi 5G_#1!!',
    'Buy $9.99-Now!!', 'See you@8PM!!!!', 'Hi, World_1!!!', 'Mom, Dad@Me#1!!',
    'I<3U, Mom#1!!', 'Thank You#1!!!!',
  ],
};

export default hard;