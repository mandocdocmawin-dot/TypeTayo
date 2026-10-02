// components/keyboard/handShapes.js
// Hand "rig": instead of fixed outlines, the hands are built from a few points and redrawn
// every frame, so the fingers can curve and reach for the next key.
//
// Coordinates use the keyboard's own unit space: 100 units = 1 key, the keyboard is
// 1500 x 500, and the arms continue down to y = 900. The fingertips therefore land on
// the right keys at any screen width.
//
// Everything is described for the LEFT hand and mirrored for the right hand
// (the home row A..; is symmetric around x = 675).
import { KEY_ROWS } from '../../game/keyLayout';

export const VIEW = { width: 1500, height: 900, keyboardHeight: 500 };

const MIRROR = 1350;
const HANDS = ['L', 'R'];

// ---------- key centers, read straight from the keyboard layout ----------
const KEY_CENTER = {};
KEY_ROWS.forEach((row, r) => {
  let x = 0;
  for (const k of row) {
    KEY_CENTER[k.id] = { x: (x + k.w / 2) * 100, y: r * 100 + 50 };
    x += k.w;
  }
});

// ---------- finger definitions (left hand) ----------
// tip: where the fingertip pad rests (home row), knuckle: where the finger joins the palm,
// w0: finger width (it tapers to ~78% at the tip).
const FINGERS = [
  { name: 'pinky', tip: { x: 225, y: 276 }, knuckle: { x: 252, y: 580 }, w0: 68 },
  { name: 'ring', tip: { x: 325, y: 262 }, knuckle: { x: 340, y: 592 }, w0: 78 },
  { name: 'middle', tip: { x: 425, y: 252 }, knuckle: { x: 431, y: 598 }, w0: 82 },
  { name: 'index', tip: { x: 525, y: 259 }, knuckle: { x: 516, y: 592 }, w0: 82 },
  { name: 'thumb', tip: { x: 634, y: 486 }, knuckle: { x: 622, y: 735 }, w0: 92, thumb: true },
];
// Where a thumb goes when it presses Space (left-hand frame)
const THUMB_SPACE = { x: 636, y: 496 };

export const FINGER_IDS = HANDS.flatMap((h) => FINGERS.map((f) => `${h}-${f.name}`));

const mx = (hand, x) => (hand === 'R' ? MIRROR - x : x);

const TILT = (16 * Math.PI) / 180; // how far each hand leans (wrist outward, fingertips inward)
const PIVOT = { x: 375, y: 255 };
const rot = (x, y) => {
  const dx = x - PIVOT.x;
  const dy = y - PIVOT.y;
  return {
    x: PIVOT.x + dx * Math.cos(TILT) - dy * Math.sin(TILT),
    y: PIVOT.y + dx * Math.sin(TILT) + dy * Math.cos(TILT),
  };
};
const restOf = (hand, f) => {
  const k = rot(f.knuckle.x, f.knuckle.y);
  return {
    tip: { x: mx(hand, f.tip.x), y: f.tip.y },
    knuckle: { x: mx(hand, k.x), y: k.y },
    len: Math.hypot(f.tip.x - k.x, f.tip.y - k.y),
  };
};

// ---------- pose solver ----------
// targets: { 'L-index': 'f', 'R-pinky': 'ShiftRight', thumb: 'Space' }  (finger id -> key id)
// Returns the wanted position of every fingertip and of each palm:
//   { 'L-palm': {x, y}, 'L-index': {x, y}, ... }
export function solvePose(targets = {}) {
  const pose = {};
  for (const hand of HANDS) {
    const goal = {}; // finger name -> point to reach
    let palm = { x: 0, y: 0 };
    let lead = null;

    for (const f of FINGERS) {
      const id = `${hand}-${f.name}`;
      const keyId = targets[id] ?? (f.thumb ? targets.thumb : undefined);
      if (!keyId) continue;
      let p;
      if (f.thumb) p = { x: mx(hand, THUMB_SPACE.x), y: THUMB_SPACE.y };
      else {
        const c = KEY_CENTER[keyId];
        if (!c) continue;
        p = { x: c.x, y: c.y + 5 + 4 }; // +4: the finger presses a little into the key
      }
      goal[f.name] = p;
      if (!lead || lead.f.thumb) lead = { f, p };
    }

    if (lead) {
      // the palm follows the reaching finger, and moves further if the finger cannot reach
      const r = restOf(hand, lead.f);
      const follow = lead.f.thumb ? 0.12 : 0.35;
      palm = { x: (lead.p.x - r.tip.x) * follow, y: (lead.p.y - r.tip.y) * follow };
      if (!lead.f.thumb) {
        const kx = r.knuckle.x + palm.x;
        const ky = r.knuckle.y + palm.y;
        const dx = lead.p.x - kx;
        const dy = lead.p.y - ky;
        const d = Math.hypot(dx, dy);
        const max = r.len * 1.2;
        if (d > max) {
          palm.x += (dx / d) * (d - max);
          palm.y += (dy / d) * (d - max);
        }
      }
    }

    pose[`${hand}-palm`] = palm;
    for (const f of FINGERS) {
      const r = restOf(hand, f);
      pose[`${hand}-${f.name}`] = goal[f.name] ?? { x: r.tip.x + palm.x, y: r.tip.y + palm.y };
    }
  }
  return pose;
}

// ---------- shape builder ----------
const fmt = (n) => Math.round(n * 10) / 10;
const pt = (p) => `${fmt(p.x)} ${fmt(p.y)}`;

function buildFinger(hand, f, tipPoint, palm) {
  const r = restOf(hand, f);
  const K = { x: r.knuckle.x + palm.x, y: r.knuckle.y + palm.y };

  // pull the end back so the round tip lands on the target, not beyond it
  let dx = tipPoint.x - K.x;
  let dy = tipPoint.y - K.y;
  let d = Math.hypot(dx, dy) || 1;
  const wTip = f.w0 * 0.78;
  const E = { x: tipPoint.x - (dx / d) * wTip * 0.35, y: tipPoint.y - (dy / d) * wTip * 0.35 };
  dx = E.x - K.x;
  dy = E.y - K.y;
  d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;

  // the shorter the distance, the more the finger curls
  const L = r.len * 1.08;
  const bulge = Math.min(28, Math.sqrt(Math.max(0, L * L - d * d)) * 0.08);
  const side = hand === 'L' ? 1 : -1;
  const C = {
    x: (K.x + E.x) / 2 + uy * side * bulge * 2,
    y: (K.y + E.y) / 2 - ux * side * bulge * 2,
  };

  const N = 14;
  const left = [];
  const right = [];
  const samples = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    const x = a * K.x + b * C.x + c * E.x;
    const y = a * K.y + b * C.y + c * E.y;
    let tx = 2 * (1 - t) * (C.x - K.x) + 2 * t * (E.x - C.x);
    let ty = 2 * (1 - t) * (C.y - K.y) + 2 * t * (E.y - C.y);
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl;
    ty /= tl;
    const w = f.w0 * (1 - 0.22 * Math.pow(t, 1.7));
    samples.push({ x, y, tx, ty, w });
    left.push({ x: x - ty * (w / 2), y: y + tx * (w / 2) });
    right.push({ x: x + ty * (w / 2), y: y - tx * (w / 2) });
  }

  const rad = fmt(wTip / 2);
  const edge =
    `M${left.map(pt).join(' L')} A${rad} ${rad} 0 0 0 ${pt(right[N])} ` +
    `L${right.slice(0, N).reverse().map(pt).join(' L')}`;

  // small drawn details: a fingernail and two knuckle creases (thumb: nail + one crease)
  // off(i, k): point on sample i, k = -1..1 across the finger (1 = left edge)
  const off = (i, k) => {
    const q = samples[i];
    return { x: q.x - q.ty * k * (q.w / 2), y: q.y + q.tx * k * (q.w / 2) };
  };
  const tip = samples[N];
  const cap = { x: tip.x + tip.tx * wTip * 0.12, y: tip.y + tip.ty * wTip * 0.12 };
  const cuticle = { x: samples[10].x - samples[10].tx * 7, y: samples[10].y - samples[10].ty * 7 };
  const nail =
    `M${pt(off(10, 0.5))} L${pt(off(12, 0.5))} Q${pt(cap)} ${pt(off(12, -0.5))} ` +
    `L${pt(off(10, -0.5))} Q${pt(cuticle)} ${pt(off(10, 0.5))} Z`;
  const crease = (i) => {
    const m = { x: samples[i].x - samples[i].tx * 4, y: samples[i].y - samples[i].ty * 4 };
    return `M${pt(off(i, -0.42))} Q${pt(m)} ${pt(off(i, 0.42))}`;
  };
  const detail = f.thumb ? `${nail} ${crease(6)}` : `${nail} ${crease(4)} ${crease(7)}`;

  return { fill: `${edge} Z`, edge, detail };
}

function buildPalm(hand, palm) {
  const P = (x, y) => {
    const r = rot(x, y);
    return pt({ x: mx(hand, r.x) + palm.x, y: r.y + palm.y });
  };
  const C = (a, b, c, d, e, f) => `C${P(a, b)} ${P(c, d)} ${P(e, f)}`;
  return {
    fill:
      // little-finger side: nearly straight, then curves in toward the wrist
      `M${P(214, 548)} ${C(200, 650, 194, 760, 202, 850)} ${C(210, 920, 216, 970, 224, 1000)} ` +
      // bottom, then the thumb-side curve (thenar) up to the thumb
      `L${P(520, 1000)} ${C(572, 960, 625, 895, 642, 815)} ` +
      // the web beside the thumb, then up the index finger side
      `C${P(636, 790)} ${P(596, 736)} ${P(582, 684)} C${P(574, 640)} ${P(568, 600)} ${P(564, 560)} ` +
      // top edge under the fingers (arched, middle finger highest)
      `L${P(516, 548)} L${P(431, 540)} L${P(340, 550)} L${P(252, 562)} Z`,
  };
}

// pose (from solvePose, possibly mid-animation) -> all path data
export function buildShapes(pose) {
  const out = {};
  for (const hand of HANDS) {
    const palm = pose[`${hand}-palm`];
    out[`${hand}-palm`] = buildPalm(hand, palm);
    for (const f of FINGERS) {
      const id = `${hand}-${f.name}`;
      out[id] = buildFinger(hand, f, pose[id], palm);
    }
  }
  return out;
}

export const HAND_LIST = HANDS;
export const FINGER_NAMES = FINGERS.map((f) => f.name);