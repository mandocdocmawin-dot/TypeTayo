// components/keyboard/handArt.js
// Hand artwork + movement for <Hands />.
//
// The two hand outlines come from "QWERTY-home-keys-position.svg" (Wikimedia Commons).
// NOTE: check the license on that file's Commons page and add the credit it asks for.
//
// The outline is stored as bezier segments. Every frame the outline is bent: a finger that has to
// reach a key rotates and stretches around its knuckle, and the outline follows smoothly, so the
// hand really looks like it moves (no glowing overlays).
//
// Coordinates: 100 units = 1 key, keyboard 1500 x 500, arms continue down to y = 900.
import { KEY_ROWS } from '../../game/keyLayout';

export const VIEW = { width: 1500, height: 900, keyboardHeight: 500 };
export const HAND_LIST = ['L', 'R'];
export const FINGER_NAMES = ['pinky', 'ring', 'middle', 'index', 'thumb'];

// ---------- the artwork (original SVG coordinates) ----------
// each row = one cubic bezier: x0,y0, x1,y1, x2,y2, x3,y3 (the outline of one hand, starting at the wrist)
const ART_SEGS = {
  L: [
    [92.58,490.61,102.36,473.5,124.33,438.44,126.36,432.36],
    [126.36,432.36,128.35,426.37,132.79,418.62,132.34,411.75],
    [132.34,411.75,130.31,380.99,132.27,343.65,132.77,302.27],
    [132.77,302.27,130.28,287.32,126.36,271.34,125.76,258.25],
    [125.76,258.25,125.1,244.06,126.2,228.46,129.76,212.36],
    [129.76,212.36,135.61,185.89,157.51,189.01,153.69,212.53],
    [153.69,212.53,152.34,220.81,149.5,229.84,151.3,248.65],
    [151.3,248.65,152.23,258.42,158.03,270.97,160.29,288.49],
    [160.29,288.49,167.77,249.81,163.77,242.57,169.19,223.88],
    [169.19,223.88,171.14,217.15,183.5,195.26,185.93,191.57],
    [185.93,191.57,194.74,178.23,217.22,183.84,214.73,197.3],
    [214.73,197.3,213.87,201.93,201.76,225.22,201.08,229.95],
    [201.08,229.95,199.42,241.52,195.02,261.58,193.55,276.17],
    [193.55,276.17,193.01,281.44,193.94,285.08,195.57,285.54],
    [195.57,285.54,197.18,285.98,200.85,282.46,202.69,275.78],
    [202.69,275.78,204.47,269.34,214.85,232.01,221.98,220.17],
    [221.98,220.17,224.8,215.47,240.98,193.28,245.28,188.34],
    [245.28,188.34,250.15,182.73,254.55,179.75,261.74,181.25],
    [261.74,181.25,268.44,182.66,273.86,187.44,272.61,195.7],
    [272.61,195.7,271.0,206.32,258.36,227.28,257.71,229.18],
    [257.71,229.18,253.11,242.67,240.67,279.37,236.89,287.91],
    [236.89,287.91,234.68,292.89,235.32,296.67,237.33,297.11],
    [237.33,297.11,239.54,297.59,242.98,294.28,246.61,288.74],
    [246.61,288.74,252.26,280.13,268.09,240.58,272.56,235.19],
    [272.56,235.19,278.87,227.58,288.14,208.23,295.59,201.15],
    [295.59,201.15,300.27,196.7,305.6,192.67,313.18,195.78],
    [313.18,195.78,320.66,198.85,320.83,206.17,319.92,211.76],
    [319.92,211.76,318.95,217.7,309.66,241.59,305.96,249.65],
    [305.96,249.65,300.01,262.62,291.26,285.52,286.76,301.69],
    [286.76,301.69,284.16,311.02,278.43,331.43,278.43,338.57],
    [278.43,338.57,278.43,348.09,280.81,364.75,290.33,356.42],
    [290.33,356.42,292.18,352.86,311.52,332.92,315.32,332.62],
    [315.32,332.62,328.41,312.4,341.59,305.73,352.2,301.88],
    [352.2,301.88,360.42,298.9,369.78,299.73,377.19,305.26],
    [377.19,305.26,373.27,314.21,357.23,326.23,352.36,338.78],
    [352.36,338.78,349.82,351.66,324.41,367.14,319.75,385.75],
    [319.75,385.75,317.2,391.76,309.71,397.96,305.13,401.04],
    [305.13,401.04,278.78,436.61,261.97,440.1,240.55,447.24],
    [240.55,447.24,231.21,450.35,215.93,478.71,199.27,513.88],
  ],
  R: [
    [680.23,488.98,670.45,471.87,648.48,436.81,646.46,430.73],
    [646.46,430.73,644.46,424.74,640.02,416.99,640.47,410.12],
    [640.47,410.12,642.5,379.36,640.54,342.02,640.04,300.64],
    [640.04,300.64,642.53,285.69,646.45,269.7,647.05,256.62],
    [647.05,256.62,647.71,242.43,646.61,226.82,643.05,210.73],
    [643.05,210.73,637.2,184.26,615.3,187.38,619.12,210.9],
    [619.12,210.9,620.47,219.18,623.31,228.21,621.51,247.02],
    [621.51,247.02,620.58,256.79,614.78,269.34,612.52,286.86],
    [612.52,286.86,605.04,248.18,609.04,240.94,603.63,222.25],
    [603.63,222.25,601.67,215.52,589.31,193.63,586.88,189.94],
    [586.88,189.94,578.07,176.6,555.59,182.21,558.09,195.67],
    [558.09,195.67,558.94,200.29,571.05,223.59,571.73,228.32],
    [571.73,228.32,573.39,239.89,577.79,259.95,579.27,274.54],
    [579.27,274.54,579.8,279.81,578.88,283.45,577.24,283.91],
    [577.24,283.91,575.63,284.35,571.96,280.83,570.12,274.15],
    [570.12,274.15,568.35,267.71,557.96,230.38,550.83,218.54],
    [550.83,218.54,548.01,213.84,531.83,191.65,527.54,186.71],
    [527.54,186.71,522.66,181.1,518.26,178.12,511.08,179.62],
    [511.08,179.62,504.38,181.03,498.95,185.81,500.2,194.07],
    [500.2,194.07,501.81,204.69,514.45,225.65,515.1,227.55],
    [515.1,227.55,519.7,241.04,532.14,277.74,535.93,286.28],
    [535.93,286.28,538.13,291.26,537.49,295.04,535.48,295.48],
    [535.48,295.48,533.27,295.96,529.83,292.65,526.2,287.11],
    [526.2,287.11,520.55,278.5,504.72,238.95,500.26,233.56],
    [500.26,233.56,493.94,225.95,484.67,206.59,477.22,199.52],
    [477.22,199.52,472.54,195.07,467.21,191.04,459.63,194.15],
    [459.63,194.15,452.15,197.22,451.98,204.54,452.89,210.13],
    [452.89,210.13,453.86,216.07,463.15,239.96,466.85,248.02],
    [466.85,248.02,472.8,260.99,481.55,283.89,486.05,300.06],
    [486.05,300.06,488.65,309.39,494.38,329.8,494.38,336.94],
    [494.38,336.94,494.38,346.46,492.0,363.12,482.48,354.79],
    [482.48,354.79,480.63,351.23,465.43,335.69,461.8,334.55],
    [461.8,334.55,453.59,311.9,442.25,302.44,432.77,296.3],
    [432.77,296.3,425.43,291.55,414.23,291.2,405.77,294.92],
    [405.77,294.92,407.58,304.52,420.5,319.84,422.42,333.16],
    [422.42,333.16,422.0,346.29,448.41,365.51,453.06,384.12],
    [453.06,384.12,455.61,390.13,463.1,396.33,467.68,399.41],
    [467.68,399.41,494.03,434.98,510.84,438.47,532.26,445.6],
    [532.26,445.6,541.6,448.72,556.88,477.08,573.54,512.25],
  ],
};

// fingertips in the artwork
const SRC_TIP = {
  L: { pinky: [144.8, 193.7], ring: [200.5, 183.9], middle: [258.3, 180.9], index: [307.9, 194.7], thumb: [377.2, 305.3] },
  R: { pinky: [628.1, 192.1], ring: [572.3, 182.3], middle: [514.7, 179.2], index: [464.8, 193.1], thumb: [405.8, 295.1] },
};
// the dips between the fingers (pinky|ring, ring|middle, middle|index, index|thumb)
const VALLEY = {
  L: [[160.3, 288.4], [195.8, 285.6], [237.8, 297.2], [285.7, 358.7]],
  R: [[612.5, 286.7], [577.0, 283.9], [535.0, 295.5], [487.1, 357.1]],
};
const THUMB_BASE = { L: [312, 385], R: [468, 378] };
const HALF_W = { pinky: 15, ring: 17, middle: 18, index: 18, thumb: 20 }; // half finger width

// ---------- finger rig: knuckle (pivot) + axis of every finger ----------
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
function buildRig(hand) {
  const v = VALLEY[hand];
  const side = hand === 'L' ? -1 : 1; // the pinky has no neighbour on its outer side
  const roots = {
    pinky: [v[0][0] + side * HALF_W.pinky, v[0][1]],
    ring: mid(v[0], v[1]),
    middle: mid(v[1], v[2]),
    index: mid(v[2], v[3]),
  };
  const rig = {};
  for (const name of FINGER_NAMES) {
    const T = SRC_TIP[hand][name];
    let B;
    if (name === 'thumb') B = THUMB_BASE[hand];
    else {
      // the pivot sits a little below the dip, inside the palm
      const M = roots[name];
      const len = Math.hypot(T[0] - M[0], T[1] - M[1]);
      B = [M[0] - ((T[0] - M[0]) / len) * 18, M[1] - ((T[1] - M[1]) / len) * 18];
    }
    const L = Math.hypot(T[0] - B[0], T[1] - B[1]);
    rig[name] = { B, T, L, ux: (T[0] - B[0]) / L, uy: (T[1] - B[1]) / L, hw: HALF_W[name] };
  }
  return rig;
}
const RIG = { L: buildRig('L'), R: buildRig('R') };

// split every bezier in smaller ones, so a finger can bend smoothly
const SUB = 8;
function subdivide(s) {
  const out = [];
  let [a, b, c, d] = [[s[0], s[1]], [s[2], s[3]], [s[4], s[5]], [s[6], s[7]]];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  for (let i = 0; i < SUB; i++) {
    // cut off the first piece [0, 1/(SUB-i)] of what is left
    const t = 1 / (SUB - i);
    const ab = lerp(a, b, t), bc = lerp(b, c, t), cd = lerp(c, d, t);
    const abc = lerp(ab, bc, t), bcd = lerp(bc, cd, t);
    const p = lerp(abc, bcd, t);
    out.push([a[0], a[1], ab[0], ab[1], abc[0], abc[1], p[0], p[1]]);
    [a, b, c, d] = [p, bcd, cd, d];
  }
  return out;
}
const SEGS = {
  L: ART_SEGS.L.flatMap(subdivide),
  R: ART_SEGS.R.flatMap(subdivide),
};

// ---------- placement: artwork -> keyboard units ----------
// scale + shift per hand, so the fingertips sit on A S D F and J K L ;
export const SCALE = 1.9;
const SHIFT = { L: { x: -58, y: -107 }, R: { x: -60.5, y: -107 } };
export const artTransform = (hand) => `translate(${SHIFT[hand].x} ${SHIFT[hand].y}) scale(${SCALE})`;

export const homeTip = (hand, name) => {
  const [x, y] = SRC_TIP[hand][name];
  return { x: x * SCALE + SHIFT[hand].x, y: y * SCALE + SHIFT[hand].y };
};

// ---------- bending the outline ----------
const smooth = (t) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};
const MIN_STRETCH = 0.72;
const MAX_STRETCH = 1.5;

// moves: { index: {x, y}, ... } how far each fingertip must move from its rest place (keyboard units).
// Returns the SVG path (in artwork coordinates) of the bent hand.
export function handPath(hand, moves = {}) {
  const rig = RIG[hand];
  // one rotation + stretch per finger that moves
  const xf = [];
  for (const name of FINGER_NAMES) {
    const m = moves[name];
    if (!m || Math.abs(m.x) + Math.abs(m.y) < 0.4) continue;
    const r = rig[name];
    const vx = r.T[0] + m.x / SCALE - r.B[0];
    const vy = r.T[1] + m.y / SCALE - r.B[1];
    const stretch = Math.min(MAX_STRETCH, Math.max(MIN_STRETCH, Math.hypot(vx, vy) / r.L));
    const ang = Math.atan2(vy, vx) - Math.atan2(r.uy, r.ux);
    xf.push({ r, stretch, cos: Math.cos(ang), sin: Math.sin(ang) });
  }

  const bend = (x, y) => {
    let dx = 0;
    let dy = 0;
    for (const f of xf) {
      const { r } = f;
      const px = x - r.B[0];
      const py = y - r.B[1];
      const a = px * r.ux + py * r.uy; // distance along the finger
      const l = -px * r.uy + py * r.ux; // distance from the finger's axis
      const w = smooth((a - 0.05 * r.L) / (0.45 * r.L)) * (1 - smooth((Math.abs(l) - r.hw * 1.15) / (r.hw * 0.9)));
      if (w <= 0) continue;
      const a2 = a + (f.stretch - 1) * Math.min(a, 0.8 * r.L); // the tip keeps its shape
      const qx = a2 * r.ux - l * r.uy;
      const qy = a2 * r.uy + l * r.ux;
      dx += w * (f.cos * qx - f.sin * qy - px);
      dy += w * (f.sin * qx + f.cos * qy - py);
    }
    return [x + dx, y + dy];
  };

  const f1 = (n) => Math.round(n * 10) / 10;
  let d = '';
  SEGS[hand].forEach((s, i) => {
    const p0 = bend(s[0], s[1]);
    const p1 = bend(s[2], s[3]);
    const p2 = bend(s[4], s[5]);
    const p3 = bend(s[6], s[7]);
    if (i === 0) d += `M${f1(p0[0])} ${f1(p0[1])}`;
    d += `C${f1(p1[0])} ${f1(p1[1])} ${f1(p2[0])} ${f1(p2[1])} ${f1(p3[0])} ${f1(p3[1])}`;
  });
  return d + 'Z';
}

// ---------- key centers, read from the keyboard layout ----------
const KEY_CENTER = {};
KEY_ROWS.forEach((row, r) => {
  let x = 0;
  for (const k of row) {
    KEY_CENTER[k.id] = { x: (x + k.w / 2) * 100, y: r * 100 + 50 };
    x += k.w;
  }
});

// ---------- which finger presses which key (touch typing) ----------
// Rows are staggered, so every key is first moved onto the home-row column it belongs to.
const ROW_SHIFT = [75, 25, 0, -50]; // number row, QWERTY row, home row, ZXCV row
function fingerOf(row, cx, w) {
  if (row >= 4) return w >= 4 ? 'thumb' : cx < 750 ? 'L-pinky' : 'R-pinky'; // space bar, Ctrl, Alt
  const x = cx + ROW_SHIFT[row];
  if (x < 275) return 'L-pinky';
  if (x < 375) return 'L-ring';
  if (x < 475) return 'L-middle';
  if (x < 675) return 'L-index';
  if (x < 875) return 'R-index';
  if (x < 975) return 'R-middle';
  if (x < 1075) return 'R-ring';
  return 'R-pinky';
}
const KEY_FINGER = {};
KEY_ROWS.forEach((row, r) => {
  let x = 0;
  for (const k of row) {
    KEY_FINGER[k.id] = fingerOf(r, (x + k.w / 2) * 100, k.w);
    x += k.w;
  }
});

// activeKey: the key to press, shiftKey: the Shift key when one is needed (or null)
// -> { 'L-index': 'g' } or { 'R-pinky': 'ShiftRight', 'L-pinky': 'a' } ...
export function targetsForKeys(activeKey, shiftKey) {
  const t = {};
  for (const id of [shiftKey, activeKey]) {
    const f = id && KEY_FINGER[id];
    if (f) t[f] = id;
  }
  return t;
}

// ---------- pose solver ----------
// targets: { 'L-index': 't', 'R-pinky': 'ShiftRight', thumb: 'Space' }  (finger id -> key id)
// Returns how far each hand shifts toward its key, and the point each active fingertip must reach:
//   { L: {x, y}, R: {x, y}, reach: { 'L-index': {x, y} } }
const MAX_REACH = 95; // how far a fingertip may still have to stretch beyond the shifted hand

export function solvePose(targets = {}) {
  const pose = { L: { x: 0, y: 0 }, R: { x: 0, y: 0 }, reach: {} };
  for (const hand of HAND_LIST) {
    let lead = null;
    for (const name of FINGER_NAMES) {
      const id = `${hand}-${name}`;
      const keyId = targets[id] ?? (name === 'thumb' ? targets.thumb : undefined);
      const c = keyId && KEY_CENTER[keyId];
      if (!c) continue;
      const home = homeTip(hand, name);
      const p = name === 'thumb'
        ? { x: home.x + (c.x - home.x) * 0.3, y: home.y - 14 }
        : { x: c.x, y: c.y + 9 }; // +9: the finger presses a little into the key
      pose.reach[id] = p;
      if (!lead || lead.thumb) lead = { name, thumb: name === 'thumb', home, p };
    }
    if (!lead) continue;

    // the hand follows the reaching finger...
    const follow = lead.thumb ? 0.12 : 0.4;
    let ox = (lead.p.x - lead.home.x) * follow;
    let oy = (lead.p.y - lead.home.y) * follow;
    // ...and moves further when the finger cannot stretch that far
    if (!lead.thumb) {
      const dx = lead.p.x - (lead.home.x + ox);
      const dy = lead.p.y - (lead.home.y + oy);
      const d = Math.hypot(dx, dy);
      if (d > MAX_REACH) {
        ox += (dx / d) * (d - MAX_REACH);
        oy += (dy / d) * (d - MAX_REACH);
      }
    }
    pose[hand] = { x: ox, y: oy };
  }
  return pose;
}