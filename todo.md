## TODO (next phase)

Idikit ito sa README. I-tick (`[x]`) lang ang mga box kapag tapos na, huwag baguhin ang laman.

### Files na ibibigay sa AI para may context
- `src/hooks/useGame.js`, `src/hooks/useKeyCapture.js`
- `src/game/gameReducer.js`, `src/game/config.js`, `src/game/fingerMap.js`, `src/game/keyLayout.js`
- `src/pages/Play.jsx`, `src/pages/Play.module.css`
- `src/components/game/WordBox.jsx` + `Wordbox.module.css`
- `src/data/words/easy.js`, `medium.js`, `hard.js`

### 1. Fix: preview word = unang salita pagkatapos ng Start
- [ ] Ngayon, random na `previewWord` sa `Play.jsx` ang ipinapakita habang `idle`, pero ibang salita ang pinipili ng `useGame` kapag pinindot ang Start.
- [ ] Ang `useGame` mismo ang pipili ng unang salita (picker) at ibibigay ito bilang preview, para pareho ang nakikita bago at pagkatapos ng Start.
- [ ] Alisin ang `previewWord` / `randomWord` sa `Play.jsx` kapag tapos na.

### 2. Letters naka-align sa mga daliri
Reference: "Fast Typing Hack" chart.
- [ ] Left pinky: Q A Z
- [ ] Left ring: W S X
- [ ] Left middle: E D C
- [ ] Left index: R T F G V B
- [ ] Right index: Y U H J N M
- [ ] Right middle: I K ,
- [ ] Right ring: O L .
- [ ] Right pinky: P ; /
- [ ] Siguraduhing tugma ang `FINGER_KEYS` sa `fingerMap.js` at ang mga salita sa word lists sa mga grupong ito (halimbawa, sa Easy, unti-unting idadagdag ang daliri/letters).
- [ ] (Pag-isipan) Kulay ng tile sa WordBox ayon sa daliri.

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
- [ ] Indicator sa WordBox kapag symbol o capital ang susunod na letra (halimbawa maliit na badge na "Shift" o "symbol").
- [ ] Mas maraming symbols habang tumataas ang level.
- [ ] Ipakita sa keyboard ang Shift key na kasabay na naka-highlight (meron na, i-polish lang).

### 7. Result modal pagkatapos ng laro
Papalit sa JSON na `<pre>` na lumalabas ngayon.
- [ ] Modal na may score, WPM, accuracy, errors, level na naabot.
- [ ] Input ng pangalan + Save to leaderboard (gumagamit ng mock hanggang Phase 4).
- [ ] Mga button: Play again, Change level, View leaderboard.
- [ ] Focus trap, Esc para isara, `role="dialog"` at `aria-modal`.
- [ ] Animation, at reduced-motion version.

### Maliliit na ayos
- [ ] `min-width: min(100%, 520px)` sa `.box` ng `Wordbox.module.css` para hindi manipis ang kahon kapag maikli ang salita.
- [ ] Subukan ang one-screen layout ng Play page sa iba't ibang laki ng screen (i-tune ang `400px` sa `.guide`).
- [ ] Phase 4: palitan ang mock leaderboard (`data/mockLeaderboard.js`) at ang `best` sa `LevelCards` ng api adapter.