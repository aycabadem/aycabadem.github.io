// Gift Wrap Game site: gift artwork, confetti, scroll reveals and a small
// playable board. Page strings come from window.GW_T (set per language).
(() => {
const T = window.GW_T || {};
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const RIBBONS = [0, 1, 2, 3].map(i => `var(--r${i})`);

// ---------- Gift artwork (same drawing as the game) ----------
const RSVG = {
  gold: { m: '#E2B04F', h: '#FFEAB0', s: '#96681E' },
  rose: { m: '#D9577E', h: '#FFB3C8', s: '#8C2548' },
  wine: { m: '#8E2241', h: '#D26A8C', s: '#4E0E24' },
};
const PAPERS = [
  { base: '#1F7159', dark: '#0E3D30', light: '#39A383', pat: 'dots', pc: '#F1D27E', rib: 'gold' },
  { base: '#A12B4C', dark: '#5A1330', light: '#CF4B71', pat: 'stripes', pc: '#F1D27E', rib: 'gold' },
  { base: '#2C4F9C', dark: '#162A5C', light: '#5378C9', pat: 'stars', pc: '#F4DB97', rib: 'gold' },
  { base: '#EDAABB', dark: '#C07489', light: '#FAD0DA', pat: 'dots', pc: '#FFFFFF', rib: 'wine' },
  { base: '#F3E6CF', dark: '#C9AE84', light: '#FFF8EA', pat: 'stripes', pc: '#D9A441', rib: 'rose' },
];
const GOLD_PAPER = { base: '#E3B653', dark: '#9C6E22', light: '#FBE3A0', pat: 'stars', pc: '#FFF6D8', rib: 'rose' };
const STAR_PATH = 'M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z';
let svgSeq = 0;
function giftSVG(g) {
  const P = g.gold ? GOLD_PAPER : PAPERS[g.paper], R = RSVG[P.rib], id = 'gw' + (++svgSeq);
  const W = g.w * 100, H = g.h * 100, k = Math.min(W, H) / 100;
  const m = 5, L = 26 * k, lidY = 14 * k, bx = m + 5 * k, by = lidY + L - 3 * k, bw = W - 2 * bx, bh = H - by - 3;
  const band = 17 * k, hy = by + bh * .5 - band * .45;
  const bs = (g.w === 2 && g.h === 2 ? 1.45 : 1) * .95;
  const pat = P.pat === 'dots'
    ? [[8, 8], [0, 0], [16, 0], [0, 16], [16, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${P.pc}" opacity=".8"/>`).join('')
    : P.pat === 'stripes'
    ? `<rect width="4" height="16" fill="${P.pc}" opacity=".5"/>`
    : `<path d="M8 3l1.3 3.7L13 8l-3.7 1.3L8 13l-1.3-3.7L3 8l3.7-1.3z" fill="${P.pc}" opacity=".85"/>`;
  const patAttrs = P.pat === 'stripes' ? 'patternTransform="rotate(35)"' : '';
  const loop = `<path d="M0 0C-8-26-40-32-36-8C-34 5-12 5 0 0Z" fill="${R.m}"/>
    <path d="M-5-3C-11-17-28-21-28-10C-26-4-13-3-5-3Z" fill="${R.s}" opacity=".55"/>
    <path d="M-9-14C-15-22-26-24-30-15" fill="none" stroke="${R.h}" stroke-width="3" stroke-linecap="round" opacity=".9"/>
    <path d="M-3 2L-17 28L-10 25L-6 32L2 4Z" fill="${R.m}"/><path d="M-3 2L-17 28L-10 25Z" fill="${R.s}" opacity=".5"/>`;
  return `<svg class="gsvg" viewBox="0 0 ${W} ${H}" aria-hidden="true">
  <defs>
    <linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="${P.light}"/><stop offset=".5" stop-color="${P.base}"/><stop offset="1" stop-color="${P.dark}"/></linearGradient>
    <linearGradient id="${id}l" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${P.light}"/><stop offset="1" stop-color="${P.base}"/></linearGradient>
    <linearGradient id="${id}r" x1="0" x2="1"><stop offset="0" stop-color="${R.s}"/><stop offset=".3" stop-color="${R.h}"/><stop offset=".6" stop-color="${R.m}"/><stop offset="1" stop-color="${R.s}"/></linearGradient>
    <linearGradient id="${id}rh" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${R.s}"/><stop offset=".3" stop-color="${R.h}"/><stop offset=".6" stop-color="${R.m}"/><stop offset="1" stop-color="${R.s}"/></linearGradient>
    <pattern id="${id}p" width="16" height="16" patternUnits="userSpaceOnUse" ${patAttrs}>${pat}</pattern>
  </defs>
  <ellipse cx="${W / 2}" cy="${H - 2}" rx="${W * .42}" ry="${5 * k}" fill="#000" opacity=".35"/>
  <g class="bodyg">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${7 * k}" fill="url(#${id}b)"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${7 * k}" fill="url(#${id}p)"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${8 * k}" fill="#000" opacity=".3"/>
    <g class="hb"><rect x="${bx}" y="${hy}" width="${bw}" height="${band * .9}" fill="url(#${id}rh)"/></g>
    <g class="vb"><rect x="${W / 2 - band / 2}" y="${by}" width="${band}" height="${bh}" fill="url(#${id}r)"/></g>
  </g>
  <g class="lidg">
    <rect x="${m - 2 * k}" y="${lidY}" width="${W - 2 * m + 4 * k}" height="${L}" rx="${7 * k}" fill="url(#${id}l)"/>
    <rect x="${m - 2 * k}" y="${lidY}" width="${W - 2 * m + 4 * k}" height="${L}" rx="${7 * k}" fill="url(#${id}p)"/>
    <rect x="${m + 6 * k}" y="${lidY + 3 * k}" width="${W - 2 * m - 12 * k}" height="${3.5 * k}" rx="2" fill="#fff" opacity=".4"/>
    <rect x="${m - 2 * k}" y="${lidY + L - 4 * k}" width="${W - 2 * m + 4 * k}" height="${4 * k}" rx="2" fill="#000" opacity=".22"/>
    <g class="vb"><rect x="${W / 2 - band / 2}" y="${lidY}" width="${band}" height="${L}" fill="url(#${id}r)"/></g>
    <g transform="translate(${W / 2} ${lidY + 3 * k}) scale(${bs * k})"><g class="bowin">
      <g>${loop}</g><g transform="scale(-1 1)">${loop}</g>
      <rect x="-8" y="-8" width="16" height="15" rx="5" fill="${R.m}"/><rect x="-5" y="-6" width="6" height="4" rx="2" fill="${R.h}" opacity=".8"/>
    </g></g>
  </g>
</svg>`;
}

// ---------- Confetti and sound ----------
const fx = $('fx'), ctx = fx.getContext('2d');
let parts = [], raf = 0;
function sizeFx() { const d = devicePixelRatio || 1; fx.width = innerWidth * d; fx.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
addEventListener('resize', sizeFx); sizeFx();
const CONF = ['#FFE7A8', '#E2B04F', '#E0668D', '#FFB3C8', '#2FA582', '#9C84DC', '#FFFFFF'];
function burst(x, y, n, power = 1) {
  if (reduced) n = Math.ceil(n / 4);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (2 + Math.random() * 7) * power;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4 * power, r: Math.random() * 6.3, vr: (Math.random() - .5) * .4,
      w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, c: CONF[i % CONF.length], life: 60 + Math.random() * 50, star: Math.random() < .25 });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.life-- > 0);
  for (const p of parts) {
    p.vx *= .985; p.vy = p.vy * .985 + .26; p.x += p.vx; p.y += p.vy; p.r += p.vr;
    ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 25); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
    if (p.star) { ctx.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? p.w * .3 : p.w * .75, a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.fill(); }
    else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
    ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
}
let actx = null;
function audio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {} }
  if (actx && actx.state === 'suspended') actx.resume();
}
function tone(f, at, d = .25, type = 'sine', vol = .1) {
  if (!actx) return;
  const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + at;
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .05);
}
const sfx = {
  place() { tone(440, 0, .09, 'triangle', .06); },
  tie() { tone(784, 0, .2); tone(1175, .09, .3); },
  pop() { tone(160, 0, .18, 'triangle', .12); [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, .04 + i * .06, .4, 'sine', .08)); },
  coin() { tone(1568, 0, .12, 'square', .025); tone(2093, .06, .2, 'square', .025); },
  line() { tone(660, 0, .12, 'triangle', .06); tone(990, .06, .18, 'triangle', .06); },
};

// ---------- Decorative gifts that wrap on a loop or on tap ----------
function makeGiftEl(host, g, cls = '') {
  const el = document.createElement('div');
  el.className = 'gift ' + cls;
  el.innerHTML = `<div class="rays"></div>${giftSVG(g)}`;
  host.appendChild(el);
  return el;
}
function wrapOnce(el, withSound, done) {
  el.classList.remove('back', 'tied', 'wrapping'); void el.offsetWidth;
  el.classList.add('wrapping');
  if (withSound) setTimeout(sfx.tie, 330);
  setTimeout(() => {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) burst(r.left + r.width / 2, r.top + r.height / 2, withSound ? 120 : 50, withSound ? 1.2 : .8);
    if (withSound) sfx.pop();
  }, 1120);
  setTimeout(() => { el.classList.remove('wrapping'); el.classList.add('back'); done && done(); }, 2300);
}
function loopGift(host, makeG, every) {
  if (!host) return;
  let n = 0, el = makeGiftEl(host, makeG(n));
  let visible = false, busy = false;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(host);
  const run = withSound => {
    if (busy) return; busy = true;
    wrapOnce(el, withSound, () => { el.remove(); el = makeGiftEl(host, makeG(++n), 'back'); busy = false; });
  };
  if (!reduced) {
    setTimeout(() => { if (visible) run(false); }, 900);
    setInterval(() => { if (visible && !document.hidden) run(false); }, every);
  }
  host.addEventListener('click', () => { audio(); run(true); });
}
loopGift($('heroGift'), n => ({ w: 1, h: 1, paper: [0, 3, 2, 1, 4][n % 5], gold: n % 5 === 4 }), 4200);
loopGift($('stepGift'), n => ({ w: 1, h: 1, paper: [3, 0, 1][n % 3] }), 3600);
loopGift($('finalGift'), n => ({ w: 1, h: 1, paper: [1, 2, 0, 3][n % 4], gold: n % 4 === 3 }), 5200);
const ringGift = $('ringGift');
if (ringGift) makeGiftEl(ringGift, { w: 1, h: 1, paper: 2 });

// ---------- Scroll reveals, sparkles, language menu ----------
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const sp = $('sparkles');
if (sp && !reduced) {
  const c = sp.getContext('2d'), dots = [];
  const size = () => { const d = devicePixelRatio || 1; sp.width = innerWidth * d; sp.height = innerHeight * d; c.setTransform(d, 0, 0, d, 0, 0); };
  addEventListener('resize', size); size();
  for (let i = 0; i < 46; i++) dots.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 2.2, s: .00008 + Math.random() * .00018, p: Math.random() * 6.3, gold: Math.random() < .7 });
  const draw = t => {
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (const d of dots) {
      const y = ((d.y - t * d.s) % 1 + 1) % 1, a = .25 + .45 * (Math.sin(t * .0015 + d.p) * .5 + .5);
      c.fillStyle = d.gold ? `rgba(255,222,150,${a})` : `rgba(247,163,188,${a * .8})`;
      c.beginPath(); c.arc(d.x * innerWidth, y * innerHeight, d.r, 0, 6.3); c.fill();
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
const langSel = $('lang');
if (langSel) langSel.addEventListener('change', () => { location.href = langSel.value; });

// ---------- Playable demo (same rules as the game, smaller) ----------
const gridEl = $('grid');
if (!gridEl) return;
const N = 8, trayEl = $('tray'), wrap = $('boardWrap');
const BASES = [
  [[[0,0]], 6], [[[0,0],[0,1]], 7], [[[0,0],[0,1],[0,2]], 6], [[[0,0],[0,1],[0,2],[0,3]], 3],
  [[[0,0],[0,1],[0,2],[0,3],[0,4]], 1], [[[0,0],[0,1],[1,0],[1,1]], 3],
  [[[0,0],[1,0],[1,1]], 6], [[[0,0],[1,0],[2,0],[2,1]], 3], [[[0,0],[0,1],[0,2],[1,1]], 2],
  [[[0,0],[0,1],[1,1],[1,2]], 1.5],
];
function norm(cells) {
  const mr = Math.min(...cells.map(p => p[0])), mc = Math.min(...cells.map(p => p[1]));
  return cells.map(([r, c]) => [r - mr, c - mc]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
const SHAPES = [];
for (const [base, w] of BASES) {
  const seen = new Map(); let cur = base;
  for (let i = 0; i < 4; i++) {
    cur = norm(cur.map(([r, c]) => [c, -r]));
    for (const v of [cur, norm(cur.map(([r, c]) => [r, -c]))]) seen.set(JSON.stringify(v), v);
  }
  for (const v of seen.values()) SHAPES.push({ cells: v, w: w / seen.size });
}
const TOTAL_W = SHAPES.reduce((s, x) => s + x.w, 0);
function randomPiece() {
  let x = Math.random() * TOTAL_W;
  for (const s of SHAPES) if ((x -= s.w) <= 0) return { cells: s.cells, color: Math.floor(Math.random() * 4) };
  return { cells: SHAPES[0].cells, color: 0 };
}
const GIFT_SIZES = [[2, 2, 5], [1, 1, 3], [1, 2, 2], [2, 1, 2]];
let S;
function boxMap(gifts = S.gifts) {
  const m = Array(N * N).fill(0);
  for (const g of gifts) for (let r = g.r; r < g.r + g.h; r++) for (let c = g.c; c < g.c + g.w; c++) m[r * N + c] = g.id;
  return m;
}
function ringOf(g) {
  const out = [], add = (r, c) => { if (r >= 0 && c >= 0 && r < N && c < N) out.push(r * N + c); };
  for (let c = g.c; c < g.c + g.w; c++) { add(g.r - 1, c); add(g.r + g.h, c); }
  for (let r = g.r; r < g.r + g.h; r++) { add(r, g.c - 1); add(r, g.c + g.w); }
  return out;
}
function ringProgress(g, grid, boxes) {
  const ring = ringOf(g);
  return { done: ring.filter(i => grid[i] >= 0 || (boxes[i] && boxes[i] !== g.id)).length, total: ring.length };
}
const makeGift = (r, c, h, w, paper, gold = false) => ({ id: S.nextId++, r, c, h, w, paper, gold, isNew: true });
function spawnGift() {
  const boxes = boxMap();
  let x = Math.random() * GIFT_SIZES.reduce((s, g) => s + g[2], 0), size = GIFT_SIZES[0];
  for (const g of GIFT_SIZES) if ((x -= g[2]) <= 0) { size = g; break; }
  const [h, w] = size, spots = [];
  for (let r = 0; r <= N - h; r++) for (let c = 0; c <= N - w; c++) {
    let free = true;
    for (let dr = -1; dr <= h && free; dr++) for (let dc = -1; dc <= w; dc++) {
      const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
      const i = rr * N + cc, inside = dr >= 0 && dr < h && dc >= 0 && dc < w;
      if (boxes[i] || (inside && S.grid[i] >= 0)) { free = false; break; }
    }
    if (!free) continue;
    const p = ringProgress({ r, c, h, w, id: -1 }, S.grid, boxes);
    if (p.done < p.total) spots.push([r, c]);
  }
  if (!spots.length) return;
  const [r, c] = spots[Math.floor(Math.random() * spots.length)];
  S.gifts.push(makeGift(r, c, h, w, Math.floor(Math.random() * PAPERS.length), Math.random() < .15));
}
function fillGifts() { while (S.gifts.length < 3) { const n = S.gifts.length; spawnGift(); if (S.gifts.length === n) break; } }
function seedTutorial() {
  S.tutorial = true;
  S.gifts.push(makeGift(2, 2, 2, 2, 0), makeGift(6, 6, 1, 1, 1), makeGift(0, 5, 1, 2, 3));
  [[1, 2, 1], [4, 2, 0], [4, 3, 2], [2, 1, 3], [3, 1, 1], [2, 4, 0], [3, 4, 2], [5, 6, 3], [0, 4, 1], [7, 0, 2], [7, 1, 2], [6, 0, 0]]
    .forEach(([r, c, col]) => { S.grid[r * N + c] = col; });
  S.tray = [{ cells: [[0, 0]], color: 1 }, { cells: [[0, 0], [1, 0], [1, 1]], color: 0 }, { cells: [[0, 0], [0, 1], [0, 2]], color: 2 }];
}
function tryPlace(p, r0, c0) {
  const boxes = boxMap(), cells = [];
  for (const [dr, dc] of p.cells) {
    const r = r0 + dr, c = c0 + dc;
    if (r < 0 || c < 0 || r >= N || c >= N) return null;
    const i = r * N + c;
    if (S.grid[i] >= 0 || boxes[i]) return null;
    cells.push(i);
  }
  return cells;
}
function fitsAnywhere(p) { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (tryPlace(p, r, c)) return true; return false; }
function newTray() { let t; for (let k = 0; k < 30; k++) { t = [randomPiece(), randomPiece(), randomPiece()]; if (t.some(fitsAnywhere)) break; } return t; }
function resolve(grid) {
  const boxes = boxMap();
  const ready = S.gifts.filter(g => { const p = ringProgress(g, grid, boxes); return p.done === p.total; });
  const lineCells = new Set(); let lines = 0;
  const filled = i => grid[i] >= 0 || boxes[i];
  for (let r = 0; r < N; r++) { let ok = true; for (let c = 0; c < N; c++) if (!filled(r * N + c)) { ok = false; break; } if (ok) { lines++; for (let c = 0; c < N; c++) lineCells.add(r * N + c); } }
  for (let c = 0; c < N; c++) { let ok = true; for (let r = 0; r < N; r++) if (!filled(r * N + c)) { ok = false; break; } if (ok) { lines++; for (let r = 0; r < N; r++) lineCells.add(r * N + c); } }
  return { ready, lineCells, lines };
}

const cellEls = [], giftEls = new Map();
for (let i = 0; i < N * N; i++) {
  const d = document.createElement('div'); d.className = 'cell';
  d.style.gridRow = Math.floor(i / N) + 1; d.style.gridColumn = (i % N) + 1;
  gridEl.appendChild(d); cellEls.push(d);
}
let preview = null, popping = new Map();
function renderBoard() {
  const boxes = boxMap(), pv = new Set(preview ? preview.cells : []);
  let res = null;
  if (preview) { const g = S.grid.slice(); for (const i of pv) g[i] = preview.color; res = resolve(g); }
  const readyIds = new Set(res ? res.ready.map(g => g.id) : []), inRing = new Set();
  for (const g of S.gifts) for (const i of ringOf(g)) inRing.add(i);
  const target = S.tutorial ? 1 * N + 3 : -1;
  cellEls.forEach((el, i) => {
    let cls = 'cell', col = null;
    const pop = popping.get(i);
    if (pop) { cls += ' ' + pop.kind; col = RIBBONS[pop.c]; if (pop.kind === 'suck') { el.style.setProperty('--dx', pop.dx + 'px'); el.style.setProperty('--dy', pop.dy + 'px'); } }
    else if (S.grid[i] >= 0) { cls += ' f'; col = RIBBONS[S.grid[i]]; }
    else if (pv.has(i)) { cls += ' g'; col = RIBBONS[preview.color]; }
    if (!pop && S.grid[i] < 0 && !boxes[i] && inRing.has(i)) cls += ' ring' + (i === target ? ' target' : '');
    if (res && res.lineCells.has(i) && (S.grid[i] >= 0 || pv.has(i))) cls += ' hl';
    el.className = cls;
    if (col) el.style.setProperty('--c', col); else el.style.removeProperty('--c');
  });
  for (const g of S.gifts) {
    let el = giftEls.get(g.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'gift' + (g.isNew ? ' new' : '') + (g.h * g.w === 1 ? ' small' : '');
      el.style.gridRow = `${g.r + 1} / span ${g.h}`; el.style.gridColumn = `${g.c + 1} / span ${g.w}`;
      el.innerHTML = `<div class="rays"></div>${giftSVG(g)}<div class="tag"></div>`;
      gridEl.appendChild(el); giftEls.set(g.id, el); g.isNew = false;
    }
    const p = ringProgress(g, S.grid, boxes);
    el.querySelector('.tag').textContent = `${p.done}/${p.total}`;
    el.classList.toggle('ready', readyIds.has(g.id));
  }
}
function renderHud() {
  $('dScore').textContent = S.score; $('dStars').textContent = S.stars;
  $('dHint').innerHTML = S.tutorial ? T.hintTut : T.hint;
}
function pieceEl(p, cell, gap, cls) {
  const el = document.createElement('div'); el.className = cls;
  const h = Math.max(...p.cells.map(x => x[0])) + 1, w = Math.max(...p.cells.map(x => x[1])) + 1;
  el.style.width = (w * (cell + gap) - gap) + 'px'; el.style.height = (h * (cell + gap) - gap) + 'px';
  for (const [r, c] of p.cells) {
    const d = document.createElement('div'); d.className = 'fcell';
    Object.assign(d.style, { left: c * (cell + gap) + 'px', top: r * (cell + gap) + 'px', width: cell + 'px', height: cell + 'px' });
    d.style.setProperty('--c', RIBBONS[p.color]); el.appendChild(d);
  }
  return el;
}
function renderTray() {
  trayEl.innerHTML = '';
  S.tray.forEach((p, i) => {
    const slot = document.createElement('div'); slot.className = 'slot';
    if (p) {
      slot.appendChild(pieceEl(p, 19, 3, 'mini'));
      if (!fitsAnywhere(p)) slot.classList.add('dim');
      slot.addEventListener('pointerdown', e => startDrag(e, i, slot));
    }
    trayEl.appendChild(slot);
  });
}
function renderOver() {
  const old = wrap.querySelector('.over'); if (old) old.remove();
  if (!S.over) return;
  const o = document.createElement('div'); o.className = 'over';
  o.innerHTML = `<div class="over-card"><div class="d-label">${T.over}</div><div class="d-score">${S.score}</div>
    <div class="d-label">${T.wrappedN.replace('{n}', S.wrapped)}</div><button class="btn" type="button">${T.again}</button></div>`;
  wrap.appendChild(o);
  o.querySelector('button').onclick = () => restart(false);
}
function renderAll() { renderHud(); renderBoard(); renderTray(); renderOver(); }
function toast(big, small) {
  const t = document.createElement('div'); t.className = 'toast';
  t.innerHTML = `${big}${small ? `<small>${small}</small>` : ''}`;
  wrap.appendChild(t); setTimeout(() => t.remove(), 1200);
}
function restart(tutorial) {
  for (const el of giftEls.values()) el.remove();
  giftEls.clear();
  S = { grid: Array(N * N).fill(-1), gifts: [], tray: [], score: 0, stars: S ? S.stars : 0, wrapped: 0, over: false, nextId: 1, tutorial: false };
  if (tutorial) seedTutorial(); else { fillGifts(); S.tray = newTray(); }
  renderAll();
}
function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
function flyPrize(x, y) {
  const target = $('dStarsPill').querySelector('svg').getBoundingClientRect();
  const tx = target.left + target.width / 2, ty = target.top + target.height / 2;
  const el = document.createElement('div'); el.className = 'fly';
  el.innerHTML = `<svg viewBox="0 0 24 24"><path fill="#E9C46A" stroke="#8E5F1C" stroke-width=".8" d="${STAR_PATH}"/></svg>`;
  document.body.appendChild(el);
  const a = el.animate([
    { transform: `translate(${x}px, ${y}px) scale(0) rotate(-90deg)` },
    { transform: `translate(${x}px, ${y - 70}px) scale(1.6) rotate(0deg)`, offset: .3 },
    { transform: `translate(${x}px, ${y - 64}px) scale(1.4) rotate(0deg)`, offset: .45 },
    { transform: `translate(${tx}px, ${ty}px) scale(.6) rotate(200deg)` },
  ], { duration: reduced ? 400 : 1150, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' });
  a.onfinish = () => { el.remove(); $('dStars').textContent = S.stars; bump($('dStarsPill')); sfx.coin(); burst(tx, ty, 14, .5); };
}
function shake() { wrap.animate([{ transform: 'none' }, { transform: 'translate(-6px,3px)' }, { transform: 'translate(5px,-4px)' }, { transform: 'translate(-3px,2px)' }, { transform: 'none' }], { duration: 320 }); }
function playWrap(g, delay, chain) {
  const el = giftEls.get(g.id); giftEls.delete(g.id);
  if (!el) return;
  el.classList.remove('ready');
  setTimeout(() => {
    el.classList.add('wrapping');
    setTimeout(sfx.tie, 330);
    setTimeout(() => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      burst(cx, cy, g.h * g.w > 1 ? 110 : 70, g.h * g.w > 1 ? 1.2 : 1);
      sfx.pop(); flyPrize(cx, cy);
      if (chain > 1) shake();
    }, 1120);
    setTimeout(() => el.remove(), 1900);
  }, delay);
}
let drag = null;
function metrics() {
  const g = gridEl.getBoundingClientRect(), inset = 12, gap = 4, pitch = (g.width - 2 * inset + gap) / N;
  return { x0: g.left + inset, y0: g.top + inset, pitch, cell: pitch - gap, gap };
}
function startDrag(e, i, slot) {
  audio();
  if (S.over || !S.tray[i]) return;
  e.preventDefault(); slot.setPointerCapture(e.pointerId);
  const m = metrics(), p = S.tray[i], el = pieceEl(p, m.cell, m.gap, 'float');
  document.body.appendChild(el);
  drag = { i, p, m, el, slot, w: parseFloat(el.style.width), h: parseFloat(el.style.height), lift: e.pointerType === 'mouse' ? 0 : m.pitch * 1.5 };
  slot.classList.add('lifting');
  slot.onpointermove = moveDrag; slot.onpointerup = () => endDrag(true); slot.onpointercancel = () => endDrag(false);
  moveDrag(e);
}
function moveDrag(e) {
  if (!drag) return;
  const { m, w, h, lift, el, p } = drag, left = e.clientX - w / 2, top = e.clientY - h / 2 - lift;
  el.style.transform = `translate(${left}px, ${top}px)`;
  const cells = tryPlace(p, Math.round((top - m.y0) / m.pitch), Math.round((left - m.x0) / m.pitch));
  preview = cells ? { cells, color: p.color } : null;
  renderBoard();
}
function endDrag(drop) {
  if (!drag) return;
  const { i, el, slot } = drag;
  el.remove(); slot.classList.remove('lifting');
  slot.onpointermove = slot.onpointerup = slot.onpointercancel = null;
  const pv = preview; drag = null; preview = null;
  if (drop && pv) commit(i, pv); else renderBoard();
}
function commit(i, pv) {
  const p = S.tray[i];
  for (const j of pv.cells) S.grid[j] = p.color;
  sfx.place();
  let gain = pv.cells.length;
  const { ready, lineCells, lines } = resolve(S.grid), m = metrics();
  popping = new Map();
  for (const g of ready) {
    const gx = (g.c + g.w / 2) * m.pitch, gy = (g.r + g.h / 2) * m.pitch;
    for (const j of ringOf(g)) if (S.grid[j] >= 0 && !popping.has(j)) {
      const r = Math.floor(j / N), c = j % N;
      popping.set(j, { c: S.grid[j], kind: 'suck', dx: gx - (c + .5) * m.pitch, dy: gy - (r + .5) * m.pitch });
    }
  }
  for (const j of lineCells) if (S.grid[j] >= 0 && !popping.has(j)) popping.set(j, { c: S.grid[j], kind: 'pop' });
  for (const j of popping.keys()) S.grid[j] = -1;
  if (popping.size) setTimeout(() => { popping = new Map(); renderBoard(); }, 400);
  if (lines) sfx.line();
  const chain = ready.length;
  let wrapGain = 0, starGain = 0;
  ready.forEach((g, k) => {
    const size = g.h * g.w, mult = g.gold ? 2 : 1;
    wrapGain += (size === 1 ? 20 : size === 2 ? 35 : 60) * mult;
    starGain += (size === 1 ? 3 : size === 2 ? 5 : 10) * mult;
    playWrap(g, k * 220, chain);
  });
  wrapGain *= Math.max(1, chain);
  const lineGain = lines * 10;
  gain += wrapGain + lineGain;
  S.gifts = S.gifts.filter(g => !ready.includes(g));
  S.wrapped += chain; S.stars += starGain;
  if (chain) {
    S.tutorial = false;
    const label = chain > 1 ? `${T.chain} ×${chain}` : ready[0].gold ? T.gold : T.wrapped;
    setTimeout(() => toast('+' + (wrapGain + lineGain), label), 1150);
  } else if (lines) toast('+' + lineGain, '');
  S.score += gain; S.tray[i] = null;
  const finish = () => {
    fillGifts();
    if (S.tray.every(x => !x)) S.tray = newTray();
    S.over = !S.tray.some(x => x && fitsAnywhere(x));
    renderAll();
  };
  renderHud(); renderBoard(); renderTray();
  if (chain) setTimeout(finish, 1500 + (chain - 1) * 220); else finish();
}
restart(true);
})();
