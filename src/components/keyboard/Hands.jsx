// components/keyboard/Hands.jsx
// Two line-art hands drawn ON TOP of the keyboard (place it inside <Keyboard>).
// The outline of the hands is bent every frame (see handArt.js): the finger that has to press
// the next key rotates and stretches toward it, and the hand follows a little.
//
// Motion (what makes it feel like real typing):
//   1. Spring physics: the finger snaps toward the key first, the hand follows a bit later,
//      and both settle with a tiny overshoot instead of sliding linearly.
//   2. Keystroke tap: on every real key press the fingertip dips down and comes back up.
//      (Falls back to tapping the finger that just finished when the target changes without a
//      keydown, e.g. on touch screens.)
//
// targets (optional): which finger presses which key, e.g. { 'L-index': 'f', 'R-pinky': 'ShiftRight' }
//          (use `thumb: 'Space'` to move both thumbs).
//          If you leave it out, the hands follow activeKey / shiftKey of the parent <Keyboard>.
import { useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  FINGER_NAMES,
  HAND_LIST,
  VIEW,
  artTransform,
  handPath,
  homeTip,
  solvePose,
  targetsForKeys,
} from './handArt';
import { KeyboardContext } from './KeyboardContext';
import styles from './Hands.module.css';

// How many key-units the hands stick out below the keyboard (Keyboard reserves this space)
export const HANDS_EXTRA_UNITS = (VIEW.height - VIEW.keyboardHeight) / 100;

// ---- tuning knobs -------------------------------------------------------------------------
const HAND_SPRING = { k: 140, c: 17 }; // hand: softer, follows a little later
const FINGER_SPRING = { k: 320, c: 27 }; // finger: snappy, tiny overshoot (c ~ 1.5 * sqrt(k) = lively)
const PRESS_DEPTH = 11; // how far the fingertip dips on a key press (key-units / 100)
const PRESS_MS = 170; // duration of one key tap
const HAND_DIP = 2.5; // the whole hand sinks a hair while a finger taps
// --------------------------------------------------------------------------------------------

const FADE_FROM = 600; // the arms fade out toward the bottom edge
const BIG = { x: -300, y: -150, width: VIEW.width + 600, height: VIEW.height + 600 };
const ALL_FINGERS = HAND_LIST.flatMap((h) => FINGER_NAMES.map((n) => `${h}-${n}`));

const fmt = (n) => Math.round(n * 10) / 10;
const zero = () => ({ x: 0, y: 0, vx: 0, vy: 0 });
const emptyPose = () => ({
  L: zero(),
  R: zero(),
  d: Object.fromEntries(ALL_FINGERS.map((id) => [id, zero()])), // how far each fingertip is from rest
});

// the pose we are moving toward, from the solved targets
function wantPose(solved) {
  const w = emptyPose();
  for (const h of HAND_LIST) {
    w[h] = { ...zero(), x: solved[h].x, y: solved[h].y };
    for (const n of FINGER_NAMES) {
      const id = `${h}-${n}`;
      const r = solved.reach[id];
      if (!r) continue;
      const home = homeTip(h, n);
      w.d[id] = { ...zero(), x: r.x - (home.x + w[h].x), y: r.y - (home.y + w[h].y) };
    }
  }
  return w;
}

// one spring step: c = current {x,y,vx,vy}, w = wanted {x,y}
function spring(c, w, s, dt) {
  c.vx += ((w.x - c.x) * s.k - c.vx * s.c) * dt;
  c.vy += ((w.y - c.y) * s.k - c.vy * s.c) * dt;
  c.x += c.vx * dt;
  c.y += c.vy * dt;
}
const settled = (c, w) =>
  Math.abs(w.x - c.x) + Math.abs(w.y - c.y) + Math.abs(c.vx) + Math.abs(c.vy) < 0.15;

export default function Hands({ targets: targetsProp }) {
  const { activeKey, shiftKey } = useContext(KeyboardContext);
  const targets = targetsProp ?? targetsForKeys(activeKey, shiftKey);

  const els = useRef({}); // name -> svg element
  const now = useRef(emptyPose()); // pose currently drawn
  const want = useRef(emptyPose()); // pose we are moving toward
  const raf = useRef(0);
  const lastT = useRef(0);
  const activeRef = useRef([]); // finger ids that currently have a target
  const prevKey = useRef(null); // previous targets (to detect a change)
  const lastKeyAt = useRef(-1e9); // when the last real keydown happened
  const presses = useRef({}); // finger id -> start time of its tap
  const pressAmt = useRef({}); // finger id -> 0..1 how deep the tap is right now

  const key = JSON.stringify(targets);
  const solved = useMemo(() => solvePose(targets), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const activeIds = Object.keys(solved.reach);

  const setEl = (name) => (el) => {
    els.current[name] = el;
  };

  // NOTE: everything below only reads refs, so a frame loop started in an older render
  // never works with stale data.
  const draw = () => {
    const n = now.current;
    const amt = pressAmt.current;
    for (const h of HAND_LIST) {
      const moves = {};
      let dip = 0;
      for (const name of FINGER_NAMES) {
        const id = `${h}-${name}`;
        const a = amt[id] || 0;
        dip = Math.max(dip, a);
        moves[name] = { x: n.d[id].x, y: n.d[id].y + PRESS_DEPTH * a };
      }
      els.current[`${h}-path`]?.setAttribute('d', handPath(h, moves));
      els.current[`${h}-g`]?.setAttribute(
        'transform',
        `translate(${fmt(n[h].x)} ${fmt(n[h].y + HAND_DIP * dip)})`
      );
    }
    for (const id of activeRef.current) {
      const [h, name] = id.split('-');
      const home = homeTip(h, name);
      const a = amt[id] || 0;
      const spot = els.current[`${id}-spot`];
      if (spot) {
        spot.setAttribute('cx', fmt(home.x + n[h].x + n.d[id].x));
        spot.setAttribute('cy', fmt(home.y + n[h].y + n.d[id].y + PRESS_DEPTH * a));
        spot.setAttribute('r', fmt(55 * (1 + 0.3 * a))); // the light "pops" on the tap
      }
    }
  };

  const tick = (t) => {
    const dt = Math.min(0.05, (t - lastT.current) / 1000 || 0.016);
    lastT.current = t;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let moving = false;

    const step = (c, w, s) => {
      if (reduce) {
        Object.assign(c, { x: w.x, y: w.y, vx: 0, vy: 0 });
        return;
      }
      spring(c, w, s, dt / 2);
      spring(c, w, s, dt / 2);
      if (settled(c, w)) Object.assign(c, { x: w.x, y: w.y, vx: 0, vy: 0 });
      else moving = true;
    };
    for (const h of HAND_LIST) step(now.current[h], want.current[h], HAND_SPRING);
    for (const id of ALL_FINGERS) step(now.current.d[id], want.current.d[id], FINGER_SPRING);

    // key taps
    for (const id of ALL_FINGERS) {
      const start = presses.current[id];
      if (start == null) {
        pressAmt.current[id] = 0;
        continue;
      }
      const a = (t - start) / PRESS_MS;
      if (a >= 1 || reduce) {
        delete presses.current[id];
        pressAmt.current[id] = 0;
      } else {
        pressAmt.current[id] = a < 0 ? 0 : Math.sin(Math.PI * a);
        moving = true;
      }
    }

    draw();
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  };

  const kick = () => {
    if (raf.current) return;
    lastT.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const startPress = (ids) => {
    if (!ids.length) return;
    const t = performance.now();
    for (const id of ids) presses.current[id] = t;
    kick();
  };

  // first paint: hands at rest, before the browser draws anything
  useLayoutEffect(() => {
    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0; // IMPORTANT: otherwise React StrictMode leaves the loop "stuck as running"
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // every real key press = one finger tap (works for double letters too)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      lastKeyAt.current = performance.now();
      startPress(activeRef.current);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // every time the targets change, glide to the new pose
  useEffect(() => {
    const prev = activeRef.current;
    const changed = prevKey.current !== null && prevKey.current !== key;
    prevKey.current = key;
    // no keydown just happened (touch screen, auto-advance)? tap the finger that just finished
    if (changed && performance.now() - lastKeyAt.current > 250) startPress(prev);

    activeRef.current = activeIds;
    want.current = wantPose(solved);
    draw();
    kick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <svg
      className={styles.hands}
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* a soft spot of light under the fingertip that has to press the key */}
        <radialGradient id="tt-hands-spot-grad">
          <stop offset="0" style={{ stopColor: 'var(--finger-active)', stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: 'var(--finger-active)', stopOpacity: 0 }} />
        </radialGradient>

        {/* fade-out toward the bottom */}
        <linearGradient id="tt-hands-fade-grad" gradientUnits="userSpaceOnUse" x1="0" y1={FADE_FROM} x2="0" y2={VIEW.height}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="tt-hands-fade" maskUnits="userSpaceOnUse" {...BIG}>
          <rect {...BIG} fill="url(#tt-hands-fade-grad)" />
        </mask>
      </defs>

      <g mask="url(#tt-hands-fade)">
        {HAND_LIST.map((h) => (
          <g key={h} ref={setEl(`${h}-g`)}>
            <g transform={artTransform(h)}>
              <path ref={setEl(`${h}-path`)} className={styles.hand} vectorEffect="non-scaling-stroke" />
            </g>
          </g>
        ))}

        {/* light under the fingertip(s) that must press the key */}
        {activeIds.map((id) => (
          <circle key={id} ref={setEl(`${id}-spot`)} r="55" className={styles.spot} />
        ))}
      </g>
    </svg>
  );
}