import { drawSprite, KING, KING_PAL, CIT, GUARD, GUARD_PAL } from './sprites.js';
import { CASES } from './cases.js';

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 192, H = 144, wrap = document.getElementById('wrap');
const box = document.getElementById('box'), txt = document.getElementById('txt');
const ba = document.getElementById('ba'), bb = document.getElementById('bb'), hud = document.getElementById('hud');

function resize() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  wrap.style.width = W * s + 'px'; wrap.style.height = H * s + 'px';
  wrap.style.marginTop = (innerHeight - H * s) / 2 + 'px';
}
addEventListener('resize', resize); resize();

// --- sound ---
let ac;
function tone(f, d, type = 'sine', v = 0.2) {
  if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d);
  o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
}
const gong = () => { tone(110, 1.5); tone(165, 1.2, 'sine', 0.1); };

// --- state ---
let stats, judged, deck, cur, cit, phase, shake, floats, t = 0;
function reset() {
  stats = { g: 5, p: 5, o: 5 }; judged = 0; deck = []; floats = []; shake = 0;
  next();
}
function next() {
  if (!deck.length) {
    deck = [...CASES];
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    if (deck[deck.length - 1] === cur) deck.unshift(deck.pop()); // no back-to-back repeat
  }
  cur = deck.pop();
  cit = { y: 150, pal: { c: cur.c, h: cur.h, k: '#1a1010', s: '#f0c090', b: '#e8b030', d: '#2a1a10' } };
  phase = 'walk'; box.style.display = 'none';
}
function ask() {
  phase = 'talk'; tone(660, 0.1, 'square', 0.05);
  txt.innerHTML = `<b>${cur.who}:</b> "${cur.text}"`;
  ba.textContent = '1: ' + cur.a.l; bb.textContent = '2: ' + cur.b.l;
  ba.style.display = bb.style.display = ''; box.style.display = 'block';
}
const NAMES = { g: 'Gold', p: 'Love', o: 'Order' };
function judge(ch) {
  if (phase !== 'talk') return;
  gong(); shake = 6; judged++;
  let fx = 30;
  for (const k in ch.e) {
    stats[k] = Math.max(0, Math.min(10, stats[k] + ch.e[k]));
    floats.push({ x: fx, y: 60, s: (ch.e[k] > 0 ? '+' : '') + ch.e[k] + ' ' + NAMES[k], c: ch.e[k] > 0 ? '#80e080' : '#ff7060', life: 90 });
    fx += 50;
  }
  const dead = Object.keys(stats).find(k => stats[k] <= 0);
  if (dead) {
    const why = { g: 'The treasury is empty. Ministers abandon the court.', p: 'The people rise up and storm the palace!', o: 'Chaos spreads. Warlords seize the land.' }[dead];
    txt.innerHTML = `<i>${ch.r}</i><br><br><b>${why}</b><br>Your reign lasted ${judged} cases.`;
    ba.textContent = 'Begin a new dynasty'; bb.style.display = 'none'; phase = 'over';
    tone(80, 2, 'sawtooth', 0.1);
  } else {
    txt.innerHTML = `<i>${ch.r}</i>`; phase = 'verdict';
    ba.style.display = bb.style.display = 'none';
    setTimeout(() => { phase = 'leave'; box.style.display = 'none'; }, 1600);
  }
}
ba.onclick = () => phase === 'over' ? reset() : judge(cur.a);
bb.onclick = () => judge(cur.b);
addEventListener('keydown', e => {
  if (e.key === '1' || e.key === 'ArrowLeft') ba.click();
  if (e.key === '2' || e.key === 'ArrowRight') bb.click();
});

// --- drawing ---
function bg() {
  ctx.fillStyle = '#4a1414'; ctx.fillRect(0, 0, W, 60);
  for (let x = 0; x < W; x += 16) { ctx.fillStyle = '#5a1c1c'; ctx.fillRect(x, 8, 14, 44); }
  ctx.fillStyle = '#e8b030'; ctx.fillRect(0, 4, W, 3); ctx.fillRect(0, 54, W, 2);
  for (let y = 60; y < H; y += 8) for (let x = 0; x < W; x += 8) {
    ctx.fillStyle = ((x + y) / 8) % 2 ? '#3a2826' : '#30201e'; ctx.fillRect(x, y, 8, 8);
  }
  ctx.fillStyle = '#8a1010'; ctx.fillRect(80, 52, 32, H);
  ctx.fillStyle = '#e8b030'; ctx.fillRect(80, 52, 1, H); ctx.fillRect(111, 52, 1, H);
  for (const px of [18, 166]) { // pillars with dragon gold bands
    ctx.fillStyle = '#b02020'; ctx.fillRect(px, 0, 10, 112);
    ctx.fillStyle = '#d03030'; ctx.fillRect(px + 2, 0, 2, 112);
    ctx.fillStyle = '#e8b030';
    for (let y = 20; y < 110; y += 22) ctx.fillRect(px, y, 10, 3);
    ctx.fillRect(px - 2, 108, 14, 4);
  }
  for (const lx of [50, 136]) { // lanterns
    const sw = Math.sin(t / 30 + lx) * 1;
    ctx.fillStyle = '#e8b030'; ctx.fillRect(lx + sw, 0, 1, 12);
    ctx.fillStyle = '#e03020'; ctx.fillRect(lx - 3 + sw, 12, 7, 9);
    ctx.fillStyle = '#ffb040'; ctx.fillRect(lx - 1 + sw, 14, 3, 5);
    ctx.fillStyle = '#e8b030'; ctx.fillRect(lx - 2 + sw, 11, 5, 1); ctx.fillRect(lx - 2 + sw, 21, 5, 1);
  }
  // dais and throne
  ctx.fillStyle = '#6a3a20'; ctx.fillRect(66, 46, 60, 10);
  ctx.fillStyle = '#e8b030'; ctx.fillRect(66, 46, 60, 1); ctx.fillRect(72, 50, 48, 1);
  ctx.fillStyle = '#e8b030'; ctx.fillRect(80, 18, 32, 30);
  ctx.fillStyle = '#b02020'; ctx.fillRect(83, 21, 26, 25);
  ctx.fillStyle = '#e8b030'; ctx.fillRect(78, 16, 4, 4); ctx.fillRect(110, 16, 4, 4);
}
function frame() {
  t++;
  if (phase === 'walk') { cit.y -= 0.6; if (cit.y <= 76) { cit.y = 76; ask(); } }
  if (phase === 'leave') { cit.y += 0.9; if (cit.y > 150) next(); }
  ctx.save();
  if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= 0.85; if (shake < 0.3) shake = 0; }
  bg();
  drawSprite(ctx, KING, KING_PAL, 88, 28 + (t % 80 < 40 ? 0 : 1));
  drawSprite(ctx, GUARD, GUARD_PAL, 52, 40);
  drawSprite(ctx, GUARD, GUARD_PAL, 124, 40, true);
  const bob = (phase === 'walk' || phase === 'leave') ? Math.abs(Math.sin(t / 6)) * -1.5 : 0;
  ctx.fillStyle = '#0006'; ctx.fillRect(91, cit.y + 14, 10, 2);
  drawSprite(ctx, CIT, cit.pal, 88, cit.y + bob);
  ctx.restore();
  ctx.font = '8px monospace'; ctx.textAlign = 'left';
  floats = floats.filter(f => (f.y -= 0.3, --f.life > 0));
  for (const f of floats) { ctx.fillStyle = '#000'; ctx.fillText(f.s, f.x + 1, f.y + 1); ctx.fillStyle = f.c; ctx.fillText(f.s, f.x, f.y); }
  const bar = n => '■'.repeat(n) + '□'.repeat(10 - n);
  hud.innerHTML = `💰 ${bar(stats.g)} &nbsp; ❤️ ${bar(stats.p)} &nbsp; ⚖️ ${bar(stats.o)} &nbsp; Cases: ${judged}`;
  requestAnimationFrame(frame);
}
reset(); frame();
