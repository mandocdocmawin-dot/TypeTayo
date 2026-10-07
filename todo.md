## TODO (next phase)

Idikit ito sa README. I-tick (`[x]`) lang ang mga box kapag tapos na, huwag baguhin ang laman.

### Files na ibibigay sa AI para may context
Ibigay ang lahat ng "Kailangan". Ang "Optional" ay kung may i-che-check sa space/thumb.

**Kailangan (para sa Step 5)**
- Itong TODO file
- `src/pages/Play.jsx`, `src/pages/Play.module.css`
- `src/hooks/useGame.js` (bagong bersyon), `src/hooks/useKeyCapture.js` (hindi pa nakikita ng AI)
- `src/components/game/ResultModal.jsx` + `ResultModal.module.css`
- `src/components/game/WordBox.jsx` + `WordBox.module.css` (kasalukuyang pangalan: `Wordbox.module.css`)
- `src/components/landing/HowItWorks.jsx`, `Hero.jsx`, `LevelCard.jsx`, `LevelCards.jsx`
- `src/pages/Static.jsx`
- `src/game/config.js`, `src/game/stages.js`, `src/game/gameReducer.js`, `src/game/fingerMap.js`, `src/game/keyLayout.js`

**Optional**
- `src/components/keyboard/Hands.jsx` at `Keyboard.jsx` (para ma-check kung umiilaw ang thumb at Space key)
- `src/components/game/Timer.jsx`
- `src/data/words/easy.js`, `medium.js`, `hard.js`, `words.test.js` (context lang, tapos na)

**Bago mag-chat:** siguraduhing naka-apply na sa project ang mga bagong bersyon ng `easy.js`, `medium.js`, `hard.js`, `words.test.js`, `fingerMap.test.js` at `useGame.js`. Tapos, patakbuhin ang `npm test`.

### 1. Fix: preview word = unang salita pagkatapos ng Start
- [x] Ngayon, random na `previewWord` sa `Play.jsx` ang ipinapakita habang `idle`, pero ibang salita ang pinipili ng `useGame` kapag pinindot ang Start.
- [x] Ang `useGame` mismo ang pipili ng unang salita (picker) at ibibigay ito bilang preview, para pareho ang nakikita bago at pagkatapos ng Start.
- [x] Alisin ang `previewWord` / `randomWord` sa `Play.jsx` kapag tapos na.

### 2. Letters naka-align sa mga daliri
Reference: "Fast Typing Hack" chart.
- [x] Left pinky: Q A Z
- [x] Left ring: W S X
- [x] Left middle: E D C
- [x] Left index: R T F G V B
- [x] Right index: Y U H J N M
- [x] Right middle: I K ,
- [x] Right ring: O L .
- [x] Right pinky: P ; /
- [x] Siguraduhing tugma ang `FINGER_KEYS` sa `fingerMap.js` at ang mga salita sa word lists sa mga grupong ito (halimbawa, sa Easy, unti-unting idadagdag ang daliri/letters).
- [x] (Pag-isipan) Kulay ng tile sa WordBox ayon sa daliri.

### 3. Levels sa loob ng bawat difficulty (Level 1, 2, 3...)
- [x] Easy: pataas ang level, nadadagdagan ang words/letters na ginagamit (Level 1 = home row lang, tapos dagdag na letters/daliri).
- [ ] Ipakita ang kasalukuyang level sa top bar at sa Play page.
- [x] Ilagay sa `config.js` ang threshold (ilang words bago tumaas ang level).
- [x] Gawin din ang parehong level system sa Medium at Hard.

### 4. Level 3 pataas: wala nang +3s bonus
- [x] Mula Level 3, walang +3s kapag natapos ang salita (`BONUS_SECONDS` = 0 sa level na iyon).
- [x] Dumadami ang hirap/laman habang tumataas ang level (dagdag na letters sa salita).
- [x] I-update ang `gameReducer.js` at tests nito.
- [ ] I-update ang "Finish words to earn +3s" sa How It Works para tumugma.

### 5. Phrases na may Space (halimbawa: "Coke Star")
- [x] Magdagdag ng two-word phrases sa word lists para sa mas mataas na level.
- [ ] Space bar = thumb. Siguraduhing gumagana ang hint at kamay (`getHint(' ')` ay nakamapa na sa `Space`).
- [ ] Ayusin ang pag-wrap ng tiles sa WordBox para sa phrases.
- [ ] Siguraduhing hindi sumasalungat ang Shift + Space (start/pause) sa pag-type ng Space.
- [x] I-update ang `words.test.js` (ngayon bawal ang space sa hard).

### 6. Symbols indicator (MVP feature)
- [x] Indicator sa WordBox kapag symbol o capital ang susunod na letra (halimbawa maliit na badge na "Shift" o "symbol").
- [x] Mas maraming symbols habang tumataas ang level.
- [ ] Ipakita sa keyboard ang Shift key na kasabay na naka-highlight (meron na, i-polish lang).

### 7. Result modal pagkatapos ng laro
Papalit sa JSON na `<pre>` na lumalabas ngayon.
- [ ] Modal na may score, WPM, accuracy, errors, level na naabot.
- [ ] Input ng pangalan + Save to leaderboard (gumagamit ng mock hanggang Phase 4).
- [x] Mga button: Play again, Change level, View leaderboard.
- [x] Focus trap, Esc para isara, `role="dialog"` at `aria-modal`.
- [x] Animation, at reduced-motion version.

### Maliliit na ayos
- [ ] `min-width: min(100%, 520px)` sa `.box` ng `Wordbox.module.css` para hindi manipis ang kahon kapag maikli ang salita.
- [ ] Subukan ang one-screen layout ng Play page sa iba't ibang laki ng screen (i-tune ang `400px` sa `.guide`).
- [ ] Phase 4: palitan ang mock leaderboard (`data/mockLeaderboard.js`) at ang `best` sa `LevelCards` ng api adapter.

---

## Status at mga natitira (idagdag sa README, 14.2 / 14.3)

### Mga desisyon
- Sa code, `stage` ang tawag sa Level 1..5 (dahil `level` na ang `easy | medium | hard`). Sa UI, "Level N" pa rin.
- `WORDS_PER_STAGE = [8, 10, 12, 14, 16]` (60 words), `MAX_STAGE = 5`, `NO_BONUS_FROM_STAGE = 3` sa `config.js`.
- Ang stage ay galing sa score (`stages.js`), walang bagong state. Ang bonus ay base sa stage ng salitang tinatapos.
- Kapag natapos ang lahat ng words ng Level 5, tapos ang round (`completed: true`) at lalabas ang modal, kahit may natitirang oras.
- Item 7: inalis ang input ng pangalan + Save to leaderboard sa modal (differences from plan, isulat sa 14.2). Hindi na kailangan ang `data/localScores.js`.
- Ang word lists ay object na may pool kada stage: `WORDS.easy[1]` hanggang `WORDS.easy[5]` (sa `useGame.js`: `WORDS[level][stage]`).
- **Easy:** letters lang, walang space, 3-5 letters. L1 home row, L2 dagdag `e i r u`, L3 dagdag top row, L4 lahat ng letters (may bottom-row letter), L5 lahat ng letters (5 letters).
- **Medium:** letters + capitals + numbers, walang symbols. L1 `Apple2`, L2 `Bridge11`, L3 `Fat Finger11` (2 words), L4 `Big Red Fox27` (3 words), L5 `Sun2 Moon Star26`.
- **Hard:** bawat salita ay may capital, number at symbol. Symbols kada stage: 1, 2, 3, 4, 5 pataas (hindi kasama ang space). Space mula L2 (1 hanggang 2). Pang-araw-araw na bagay lang (password, presyo, oras, petsa), walang developer words.
- Walang space sa Easy. Space sa Medium mula L3, sa Hard mula L2.
- Hanggang 16 characters ang bawat salita (may test).
- **Walang space na kasunod ng character na kailangan ng Shift** (capital, `!`, `%`, `$`), dahil ang `Shift + Space` ay start/pause sa `Play.jsx`. May test dito.
- `useGame.js` ay nagbabalik na ng `stage` at `completed`, at ang `result` ay may `stage` at `completed` na rin.

### Mga file na nabago na
- Bago o binago sa Step 3 at 4: `src/data/words/easy.js`, `medium.js`, `hard.js`, `words.test.js`, `src/game/fingerMap.test.js` (flatten ang pools), `src/hooks/useGame.js` (stage, bagong picker kada stage, `completed`).
- Dati nang nagawa: `src/game/stages.js`, `fingerColors.js`, `ResultModal.jsx` + `ResultModal.module.css`, `gameReducer.js` (stage bonus + `completed`) at `gameReducer.test.js`, `Play.jsx`, `WordBox.jsx`, `Wordbox.module.css`, `Tokens.css` (`--finger-*`).
- Na-verify sa simulation (buong round sa Easy, Medium at Hard): tamang pool kada stage, +3s sa unang 18 words lang, `completed: true` sa 60 words, at tamang `stage` kapag timeout.

### Natitira: Step 5 (UI)
- [ ] `Play.jsx`: ipakita ang "Level N" (galing sa `game.stage`) sa tabi ng difficulty badge sa top bar. Dagdagan ang `Play.module.css` ng style para dito.
- [ ] `Play.jsx`: guard para sa Shift + Space. Sa `onToggle`, kapag `status === 'playing'` at ang susunod na character (`game.word[game.index]`) ay space, huwag i-pause at huwag i-`preventDefault` / `stopImmediatePropagation` (hayaang dumaan ang key). Gumagana lang ito kung tama rin ang pagbasa ng `useKeyCapture.js` sa Space (i-check).
- [ ] `Play.jsx`: ang hint na "Time is up!" ay dapat iba kapag `completed`.
- [ ] `ResultModal.jsx`: ilagay ang level na naabot (`result.stage`) at ibang pamagat kapag `result.completed` (halimbawa "You finished all levels!") imbes na "Time is up!".
- [ ] `ResultModal.module.css`: alisin ang hindi na ginagamit na `.save`, `.saveRow` at ang `input` styles; magdagdag ng maliit na style para sa "Level N".
- [ ] `WordBox.jsx` / `WordBox.module.css`: gawing nakikita ang space tile (halimbawa maliit na marker na `␣`, hindi walang laman na kahon) at i-wrap ang tiles para sa phrases (`flex-wrap`, hanggang 16 characters).
- [ ] Palitan ang mga text na "+3s" para tumugma sa rule (bonus sa Level 1 at 2 lang):
  - `HowItWorks.jsx`: "Finish words to earn +3s"
  - `Hero.jsx`: "Finish a word, earn +3 seconds."
  - `LevelCard.jsx`: "30s + 3s per word"
  - `Static.jsx` (About): "earn extra seconds for every word you finish"
- [ ] `LevelCards.jsx`: palitan ang mga description at preview na hindi na tama.
  - Easy: "Short words, home row keys" (hindi na home row lang).
  - Medium: "Longer words, all letters" (may capitals, numbers at phrases na).
  - Hard: "Capitals, numbers and symbols" (OK pa, pero puwedeng banggitin ang pang-araw-araw na salita).
  - Medium preview: `keyboard` ay lowercase pa; palitan ng halimbawa tulad ng `Fat Finger11`.
- [ ] I-check sa browser: umiilaw ba ang thumb at ang Space key kapag space ang susunod na character (`Hands.jsx`, `Keyboard.jsx`).
- [ ] Opsyonal: ang timer ay 0:00 kapag `completed`, kahit may natitirang oras.
- [ ] Opsyonal sa `Play.module.css`: alisin ang lumang `.result` class (hindi na ginagamit) at ang doble ng `padding-inline` sa `.stats li`.

### Dapat i-check
- [x] Ang `'/'` (Change level) at `'/leaderboard'` (View leaderboard) sa `Play.jsx` ay hula lang. Palitan ng tamang routes. (Na-check sa `App.jsx`: tama na ang dalawa, walang kailangang baguhin.)
- [ ] Casing ng CSS: `WordBox.jsx` ay nag-i-import ng `./WordBox.module.css` pero ang file ay `Wordbox.module.css`. I-rename para hindi masira sa Linux/deploy. Sa Windows: `git mv src/components/game/Wordbox.module.css src/components/game/WordBox.module.css` (kung hindi tumalab, rename muna sa pansamantalang pangalan).
- [ ] Mag-commit kada tapos na item (nawala ang mga hindi pa naka-commit nang mag-`git reset --hard`). Mag-commit na ngayon ng Step 3 at 4.