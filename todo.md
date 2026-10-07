## TODO (next phase)

Idikit ito sa README. I-tick (`[x]`) lang ang mga box kapag tapos na, huwag baguhin ang laman.

### Files na ibibigay sa AI para may context
- `src/hooks/useGame.js`, `src/hooks/useKeyCapture.js`
- `src/game/gameReducer.js`, `src/game/config.js`, `src/game/fingerMap.js`, `src/game/keyLayout.js`
- `src/pages/Play.jsx`, `src/pages/Play.module.css`
- `src/components/game/WordBox.jsx` + `Wordbox.module.css`
- `src/data/words/easy.js`, `medium.js`, `hard.js`

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
- [ ] Easy: pataas ang level, nadadagdagan ang words/letters na ginagamit (Level 1 = home row lang, tapos dagdag na letters/daliri).
- [ ] Ipakita ang kasalukuyang level sa top bar at sa Play page.
- [ ] Ilagay sa `config.js` ang threshold (ilang words bago tumaas ang level).
- [ ] Gawin din ang parehong level system sa Medium at Hard.

### 4. Level 3 pataas: wala nang +3s bonus
- [ ] Mula Level 3, walang +3s kapag natapos ang salita (`BONUS_SECONDS` = 0 sa level na iyon).
- [ ] Dumadami ang hirap/laman habang tumataas ang level (dagdag na letters sa salita).
- [ ] I-update ang `gameReducer.js` at tests nito.
- [ ] I-update ang "Finish words to earn +3s" sa How It Works para tumugma.

### 5. Phrases na may Space (halimbawa: "Coke Star")
- [ ] Magdagdag ng two-word phrases sa word lists para sa mas mataas na level.
- [ ] Space bar = thumb. Siguraduhing gumagana ang hint at kamay (`getHint(' ')` ay nakamapa na sa `Space`).
- [ ] Ayusin ang pag-wrap ng tiles sa WordBox para sa phrases.
- [ ] Siguraduhing hindi sumasalungat ang Shift + Space (start/pause) sa pag-type ng Space.
- [ ] I-update ang `words.test.js` (ngayon bawal ang space sa hard).

### 6. Symbols indicator (MVP feature)
- [x] Indicator sa WordBox kapag symbol o capital ang susunod na letra (halimbawa maliit na badge na "Shift" o "symbol").
- [ ] Mas maraming symbols habang tumataas ang level.
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

### Bagong files na nagawa na
- `src/game/stages.js` (stageForScore, bonusSecondsForStage, isComplete, TOTAL_WORDS)
- `src/game/fingerColors.js`, `src/game/fingerMap.test.js`
- `src/components/game/ResultModal.jsx` + `ResultModal.module.css`
- Binago: `gameReducer.js` (stage bonus + `completed`) at `gameReducer.test.js`, `useGame.js` (preview), `Play.jsx`, `WordBox.jsx`, `Wordbox.module.css`, `Tokens.css` (`--finger-*`)

### Natitira sa Levels (Items 3 at 4)
- [ ] Step 3: `easy.js` na may pool kada stage: L1 home row (`asdfghjkl`), L2 dagdag `e i r u`, L3 buong top row, L4 at L5 lahat ng letters. I-update ang `words.test.js` para sa bagong hugis.
- [ ] Gawin din ang pool kada stage sa `medium.js` at `hard.js` (Hard: dumadami ang symbols habang tumataas ang stage).
- [ ] Step 4: `useGame.js`: kunin ang stage mula sa score, gumawa ng bagong picker kapag nagpalit ang stage, ibalik ang `stage` at `completed`.
- [ ] Step 5 (UI): ipakita ang "Level N" sa top bar ng `Play.jsx`; sa `ResultModal` ilagay ang level na naabot at ibang pamagat kapag `completed`; i-update ang "Finish words to earn +3s" sa How It Works.

### Dapat i-check
- [ ] Ang `'/'` (Change level) at `'/leaderboard'` (View leaderboard) sa `Play.jsx` ay hula lang. Palitan ng tamang routes.
- [ ] Casing ng CSS: `WordBox.jsx` ay nag-i-import ng `./WordBox.module.css` pero ang file ay `Wordbox.module.css`. I-rename para hindi masira sa Linux/deploy.
- [ ] Mag-commit kada tapos na item (nawala ang mga hindi pa naka-commit nang mag-`git reset --hard`).