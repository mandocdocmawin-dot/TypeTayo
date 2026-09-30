# TypeTayo: Frontend Plan

This is the plan we will follow for the frontend. It is based on the two mockups (in-game screen and landing page) and the decisions made so far.

## 1. Decisions made

| Item | Decision |
|---|---|
| Name | TypeTayo |
| Stack | React + Vite (JavaScript/JSX), React Router, CSS variables + CSS Modules |
| Players | No login for now (MVP). Only a name after the game. **TODO: add login/accounts later** (see Section 13) |
| Words | English first |
| Levels | Easy (home row, short), Medium (longer, all letters), Hard (capitals, numbers, symbols) |
| Time | 30 seconds at the start, +3 seconds per completed word |
| Ranking | Words completed. Tie-breakers: WPM, then accuracy |
| Backend | None yet. Local adapter (localStorage) now, HTTP adapter later |
| Logo | "TypeTayo" wordmark where the "o" is an eight-ray sun |

## 2. Design tokens (from the mockups)

```css
:root {
  --bg: #0A1024;
  --bg-elevated: #10183A;
  --border: #1B2650;
  --text: #FFFFFF;
  --text-muted: #9FB0D9;
  --cyan: #1FD1FF;      /* main accent, current letter, Medium */
  --orange: #FFB020;    /* +3s bonus, Hard, sun logo */
  --green: #4ADE80;     /* typed letters, Easy */
  --danger: #FF5C7A;    /* wrong key */
  --radius: 14px;
}
```

- Font: bold rounded sans-serif (Nunito, Poppins, or Baloo) for the UI. Monospace (JetBrains Mono or Fira Code) for the word box and hints.
- Light theme: a second set of variables under `[data-theme="light"]`. Dark is the default.
- The blur is CSS `filter: blur()` plus `opacity`, with a transition so letters sharpen as the player reaches them.

## 3. Screens and routes

| Route | Screen | Contents |
|---|---|---|
| `/` | Landing | Nav, hero, level cards, how it works, leaderboard preview, footer |
| `/play/:level` | Game | Countdown, word box, timer, stats, keyboard + hands, controls |
| `/play/:level` (finished) | Result | Score, WPM, accuracy, name input, submit, play again |
| `/leaderboard` | Leaderboard | Tabs per level, top 10 |
| `/about`, `/privacy`, `/contact` | Placeholders | Simple text for now |

"How to Play" in the nav scrolls to the "How It Works" section on the landing page.

## 4. Folder structure

```
src/
  api/
    index.js            # picks the adapter based on VITE_API_MODE
    localAdapter.js
    httpAdapter.js      # stub for now, with TODOs
  components/
    layout/             # Navbar, Footer, ThemeToggle
    landing/            # Hero, LevelCard, HowItWorks, LeaderboardPreview
    game/               # WordBox, Timer, StatsBar, BonusPopup, Countdown, GameControls
    keyboard/           # Keyboard, Key, Hands
    result/             # ResultPanel, NameForm
    leaderboard/        # LeaderboardTable, LevelTabs
    common/             # Logo, Button, Badge
  game/
    config.js           # START_SECONDS, BONUS_SECONDS, LEVELS
    gameReducer.js      # state machine
    scoring.js          # pure functions: wpm, accuracy, sort
    fingerMap.js        # key -> finger
    keyLayout.js        # QWERTY rows for the keyboard component
    wordPicker.js       # shuffle, no repeats until the pool is used up
  data/
    words/easy.js
    words/medium.js
    words/hard.js
  hooks/
    useGame.js
    useKeyCapture.js
    useLocalStorage.js
    useTheme.js
  pages/
    Landing.jsx
    Play.jsx
    Leaderboard.jsx
    Static.jsx
  styles/
    tokens.css
    global.css
  main.jsx
  App.jsx
```

## 5. Game rules (spec)

**Config** (in `game/config.js` so it is easy to change):

```js
export const START_SECONDS = 30;
export const BONUS_SECONDS = 3;
export const COUNTDOWN_SECONDS = 3;
export const MAX_SECONDS = null;          // no cap in the MVP
export const BONUS_ONLY_IF_CLEAN = false; // true = +3s only if the word had no mistakes
```

**State machine:** `idle → countdown → playing → paused → finished`

**Rules:**
- Only one word is shown at a time, as a single straight line of letter tiles.
- Correct key: the tile turns green and the blur on the next letter clears.
- Wrong key: the word does not advance, the tile shakes with a short red flash, and the error count goes up.
- Word completed: +3s, a "+3s" popup appears, score +1, next word.
- Game over when time hits 0.
- Pause: automatic when the window loses focus, or when Pause is pressed. The clock does not run while paused.
- Esc: quit back to the landing page (with a confirm).
- `keydown` events with `repeat` are ignored, and modifier keys (Shift, Ctrl, Alt) pressed alone are ignored.
- Comparison uses `event.key`, so capitals and symbols work. Call `preventDefault` on Space and on keys that trigger scrolling or quick find (`'` and `/`).

**Timing:** use an `endsAt` timestamp with `performance.now()` instead of a plain `setInterval` that subtracts 1, so the timer does not drift.

**Scoring (pure functions in `scoring.js`):**
- `score` = number of completed words
- `accuracy` = correct keystrokes / total keystrokes × 100
- `wpm` = (correct characters / 5) / minutes actually played
- Leaderboard sort: `score` desc, `wpm` desc, `accuracy` desc, `createdAt` asc

## 6. Word lists

| Level | Contents | Examples | Count |
|---|---|---|---|
| Easy | 3-5 letters, home row only (a s d f g h j k l) | sad, fall, glad, flask | 60-100 |
| Medium | 5-9 letters, all lowercase letters | keyboard, planet, journey | 100+ |
| Hard | Mix of capitals, numbers, and symbols | Hello#2026, Tayo_99, Q&A! | 80+ |

`wordPicker` shuffles the whole pool and does not repeat a word until the pool is exhausted. Word lists live in separate files so they can be swapped for `getWords(level)` from the backend later.

## 7. Keyboard and hands

**Keyboard:**
- Full QWERTY: number row, Tab, Caps Lock, Shift, Enter, Backspace, Space, Ctrl, Alt.
- **Only one key glows** (the next key to press). In the mockup two keys are highlighted (F and B); we will fix that.
- On Hard, when a capital or symbol is needed, the key itself **and** the Shift key on the opposite hand both light up.

**Finger map (`fingerMap.js`):**

| Finger | Keys |
|---|---|
| Left pinky | ` 1 Q A Z, Left Shift |
| Left ring | 2 W S X |
| Left middle | 3 E D C |
| Left index | 4 5 R T F G V B |
| Right index | 6 7 Y U H J N M |
| Right middle | 8 I K , |
| Right ring | 9 O L . |
| Right pinky | 0 - = P [ ] ; ' / \ Enter Backspace, Right Shift |
| Thumbs | Space |

Shifted symbols (like `#`, `!`, `?`) use the same finger as their base key (`3`, `1`, `/`). Shift is always pressed with the hand opposite to the finger that types the key.

**Hands SVG (the hardest part, so we split it up):**
1. **Static:** two line-art hands resting on the home row, no animation.
2. **Finger highlight:** each finger is its own SVG path with an id (`L-pinky`, `R-index`, and so on). The correct finger glows cyan.
3. **Reach animation (optional):** the finger moves slightly toward the key using a CSS transform.
4. **Toggle:** "Show hands" (saved in localStorage) for advanced players.

The hands in the mockup are AI-generated, so we cannot use them directly. We will build our own simple SVG hands in a matching style.

## 8. Landing page (based on the mockup)

- **Navbar:** logo, How to Play, Leaderboard, theme toggle. No login or sign up for now. **TODO: add Login / Sign up buttons when accounts are built** (see Section 13).
- **Hero:** headline "Type fast. Beat the clock.", subheadline, a demo word strip ("keyboard" with blur), and a faint keyboard with hands.
- **Level cards:** Easy (green), Medium (cyan, "Most popular"), Hard (orange). Each has a word preview, "30s + 3s per word", "Personal best", and a Play button.
- **How It Works:** three steps with icons.
- **Leaderboard preview:** tabs per level, top 5. Empty state: "Be the first to set a score!"
- **Footer:** small logo, "Made with love in the Philippines", About, Privacy, Contact.

**Note:** the sample players in the mockup (KuyaJM, Ate_Bea, and so on) are placeholders. In the real app the leaderboard is empty until someone plays. Do not seed fake scores.

## 9. Game screen (based on the mockup)

- **Top bar:** logo (click to go back), level badge, Score (words), WPM, Accuracy.
- **Top center:** large timer with a progress bar and a "+3s" popup on each completed word.
- **Word box:** a single straight line of tiles. Typed = green, current = cyan border and slightly larger, upcoming = blurred.
- **Hint:** "Press the highlighted key".
- **Keyboard + hands** at the bottom.
- **Footer controls:** Show hands toggle, Pause, "Esc to quit".
- **3-2-1 countdown** before the game starts.
- **Result panel:** Score, WPM, accuracy, personal best (with a "New best!" badge), name input, Submit, Play again, Change level.

## 10. Local API adapter (the "socket" for the backend)

Components never call `localStorage` or `axios` directly. They go through `api/index.js`.

```js
// api/index.js
import * as local from './localAdapter';
import * as http from './httpAdapter';
export default import.meta.env.VITE_API_MODE === 'http' ? http : local;
```

| Function | Local mode | HTTP mode (later) |
|---|---|---|
| `getWords(level)` | Word list bundled in the app | `GET /api/words/:level` |
| `startGame(level)` | Creates a local `gameId` and `startedAt` | `POST /api/games/start` |
| `submitScore(gameId, payload)` | Saves to localStorage | `POST /api/games/:id/submit` |
| `getLeaderboard(level, limit)` | Reads from localStorage | `GET /api/leaderboard/:level` |

**Payload shape** (must be the same in both adapters):

```js
{
  playerName: 'KuyaJM',
  level: 'medium',
  score: 48,        // words completed
  wpm: 72,
  accuracy: 98.2,
  durationMs: 96400,
  keystrokes: 412   // for server-side checks later
}
```

Every function is `async` even when the local version is synchronous, so no component changes when we switch to HTTP.

**localStorage keys:**
- `typetayo:scores:{level}`: array of the top 20
- `typetayo:best:{level}`: personal best
- `typetayo:name`: last used name
- `typetayo:theme`: `dark` or `light`
- `typetayo:showHands`: `true` or `false`

**Name validation:** 2-16 characters, letters, numbers, `_` and `-` only, with a simple blocklist of offensive words. In local mode, one player name may have multiple entries.

## 11. Phases and checklists

### Phase 0: Setup
- [x] `npm create vite@latest typetayo -- --template react`
- [x] Install `react-router-dom` and `vitest`
- [x] Create the folder structure above
- [x] `tokens.css`, `global.css`, and fonts
- [x] `.env.example` with `VITE_API_MODE=local`
- [x] Git init, `.gitignore`, first commit

**Done when:** `npm run dev` runs and the App shell renders with the router.

### Phase 1: Game core (no keyboard UI yet)
- [x] Word lists (easy, medium, hard)
- [x] `wordPicker.js`, `scoring.js`, `config.js`
- [x] Unit tests for scoring and wordPicker
- [x] `gameReducer.js` (state machine)
- [x] `useKeyCapture` (keydown, no repeat, no modifier-only)
- [x] `WordBox` with typed, current, and blurred states
- [x] `Timer` with progress bar and `BonusPopup`
- [x] Error handling: shake and error count

**Done when:** you can play Easy, Medium, and Hard on a simple page, and the timer, +3s, score, WPM, and accuracy all work.

### Phase 2: Keyboard and hands
- [ ] `keyLayout.js` and the `Keyboard` component
- [ ] Only one key glows, plus Shift for capitals and symbols
- [ ] `fingerMap.js` with tests
- [ ] Static `Hands` SVG
- [ ] Finger highlight
- [ ] "Show hands" toggle
- [ ] (Optional) reach animation

**Done when:** the finger and key are correct for every letter, number, and symbol on Hard.

### Phase 3: Screens and flow
- [ ] Landing page (navbar, hero, level cards, how it works, footer)
- [ ] 3-2-1 countdown
- [ ] Pause, and auto-pause when focus is lost
- [ ] Result panel with name form
- [ ] Leaderboard page with tabs
- [ ] Play again and Change level
- [ ] Esc to quit with confirm

**Done when:** the full flow from landing to leaderboard works.

### Phase 4: Local adapter
- [ ] `api/index.js` and `localAdapter.js`
- [ ] Wire every screen to the adapter, not to localStorage
- [ ] Personal best on the level cards
- [ ] Leaderboard preview on the landing page, with empty state
- [ ] `httpAdapter.js` stub with the same function names and TODO comments

**Done when:** switching the adapter requires no component changes.

### Phase 5: Polish and deploy
- [ ] Responsive layout (mobile and tablet)
- [ ] Message on touch devices: "TypeTayo works best with a physical keyboard"
- [ ] Light theme
- [ ] Loading, error, and empty states
- [ ] Accessibility: focus outlines, `aria-live` for timer and score, contrast check, `prefers-reduced-motion`
- [ ] Sounds (optional, with a mute button)
- [ ] Favicon (sun or "TT" icon), page title, and meta tags
- [ ] Deploy to Vercel, Netlify, or Cloudflare Pages, then connect the domain

### TODO (after the MVP)
- [ ] **Login / accounts:** the MVP has no login. Decide the login method (email, Google, or username + password), then add Login / Sign up to the navbar, link scores to accounts, and add a profile page.

## 12. Open questions

1. **Bonus rule:** always +3s, or +3s only when the word has no mistakes? (Default: always +3s. It is a config value.)
2. **Time cap:** is there a maximum (for example 60s), or no limit? (Default: no limit.)
3. **Wrong key:** the word does not advance (default), or it advances but counts an error?
4. **Sounds:** do you want a key click sound and a +3s chime?
5. **Domain:** typetayo.com and typetayo.ph are not confirmed yet. This is a separate task you can do while we code.
6. **Login (TODO):** when should accounts be added, and which login method? Not needed for the MVP.

## 13. Later (not in scope now)

Login / accounts (TODO), backend (Laravel API, anti-cheat, rate limits), admin side, Tagalog word lists, daily challenge, and achievements. These are in the master plan and will not change the frontend structure when added.

## 14. Status and AI handoff (keep this section updated)

**Rule for whoever updates this file (human or AI):** when asked to "check" progress, only tick the boxes in Section 11. Do not rewrite or reorder the plan. Put any differences from the plan in 14.2 instead.

### 14.1 Current status (2026-10-01)

- **Done, tests passing (25 tests):** `config.js`, `scoring.js`, `wordPicker.js`, `gameReducer.js`, each with tests except `config.js`.
- **Tested in the browser:** `useKeyCapture.js`, `useGame.js` (typing, errors, +3s bonus, score, WPM, accuracy, and the `finished` result). Not yet verified: Pause/Resume, auto-pause on blur, Esc quit.
- **Done:** `easy.js`, `medium.js` (100+ words), `hard.js` (80+ entries), `words.test.js` (Easy, Medium, Hard), `WordBox`, `Timer`, `BonusPopup` (shake on error), `Play.jsx` using those components, `LEVELS` in `config.js`, App shell with router (`/` and `/play/:level`).
- **Written but not yet verified in the browser:** `WordBox`, `Timer`, `BonusPopup`, the new `Play.jsx`, and Medium/Hard play. Run `npx vitest run` to confirm the word-list tests.
- **Not started:** Phase 2 onward.

### 14.2 Differences from the plan

- Style files are capitalized: `Tokens.css`, `Global.css`, `Fonts.css` (plan says lowercase). Imports must match the exact casing, because Vercel and Netlify are case-sensitive.
- `calcWpm(correctChars, durationMs)` takes milliseconds, not minutes.
- The reducer state has extra fields: `remainingMs`, `pausedAt`, `pausedMs`, `playedMs`, `wordHadError`, `bonusCount`.
- The reducer is pure. `useGame` passes `now` (from `performance.now()`) and `nextWord` (from `picker.next()`) inside each action. Never call `performance.now()` or `Math.random()` inside the reducer.
- `LEVELS` now exists in `config.js` and `Play.jsx` imports it. `useGame.js` still has its own `WORDS` map keyed by level.
- Game components use CSS Modules (`WordBox.module.css`, `Timer.module.css`, `BonusPopup.module.css`, `Play.module.css`) next to the component. They only use variables from `Tokens.css`.
- `WordBox` detects a new error from the `errors` prop and `BonusPopup` detects a new bonus from `bonusCount`. `useGame` was not changed for this.
- The unused `tt-shake` and `tt-bonus-pop` keyframes were removed from `Global.css`, and its reduced-motion rule no longer forces animations off. Each game component has its own reduced-motion version.
- The submit payload (Section 10) has no `createdAt`, but `sortScores` needs it. `localAdapter` must add `createdAt` when saving.
- Pause does not auto-resume. After a blur, the player presses Resume.

### 14.3 TODO (next)

- [x] Fill `medium.js` (100+ words, 5-9 lowercase letters) and `hard.js` (80+ entries with capitals, numbers, and symbols)
- [x] Extend `words.test.js` (Easy only for now) with Medium and Hard checks
- [ ] Verify in the browser: Pause/Resume, auto-pause on blur, and Esc quit
- [x] `WordBox` (typed, current, blurred), `Timer` with progress bar, `BonusPopup`, shake on error
- [ ] Check the remaining Phase 0 leftovers: full folder structure (checked), contents of `Global.css` (checked), `.env.example` (still to check)
- [x] Add `LEVELS` to `config.js`, or remove it from the folder structure comment (`Play.jsx` currently has its own local `LEVELS`)

### 14.4 Files to give an AI so it understands the flow

**Always include:**
- `README.md` (this plan)
- `src/game/config.js`
- `src/game/gameReducer.js`
- `src/hooks/useGame.js` (its return value is the interface for all game UI)
- `src/hooks/useKeyCapture.js`

**Add depending on the task:**
- Scoring or leaderboard: `src/game/scoring.js`, `src/game/wordPicker.js`, and their test files
- Game screen UI: `src/pages/Play.jsx`, the component being edited, `src/styles/Tokens.css`
- API adapter: Section 10 of this file and the `result` object returned by `useGame`

**Usually not needed:** word list files (long) unless changing them, and the Vite template files (`App.css`, `index.css`).

### 14.5 Flow in short

`Play.jsx` calls `useGame(level)`. The hook creates a `wordPicker`, runs the countdown, the timer loop (`requestAnimationFrame` with `endsAt`), and auto-pause, and listens to keys through `useKeyCapture`. Every change goes through `gameReducer` (`idle, countdown, playing, paused, finished`). When the game is finished, `useGame` returns `result`, which has the same shape as the submit payload minus `playerName`.