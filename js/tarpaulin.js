// Full-screen celebrant spotlight: 8 tarpaulin themes with their own effects.
import { $, el, hash, pick, rnd, toast } from "./utils.js";
import { compute } from "./data.js";
import { greet, greeting } from "./greeting.js";
import { downloadIcs } from "./calendar.js";

let spotList = [];

const grommets = () => ["g1", "g2", "g3", "g4"].map(c => el("i", "gr " + c));

const replay = t => { t.style.animation = "none"; void t.offsetWidth; t.style.animation = ""; };

const THEMES = [
  { id: "classic", fx: [{ k: "up", e: ["🎈", "🎈", "🎉", "🎊"] }, { k: "cannons" }] },
  { id: "fiesta", fx: [{ k: "up", e: ["🎊", "🎉", "🎈"] }, { k: "cannons" }] },
  { id: "royal", fx: [{ k: "down", e: ["✨", "⭐", "👑"] }, { k: "gold" }] },
  { id: "sweet", fx: [{ k: "up", e: ["💖", "🌸", "💗", "🎀"] }] },
  { id: "neon", fx: [{ k: "fireworks" }] },
  { id: "tropical", fx: [{ k: "down", e: ["🌺", "🌴", "🥥"] }, { k: "cannons" }] },
  { id: "galaxy", fx: [{ k: "down", e: ["✨", "⭐", "🌟"] }, { k: "stars" }] },
  { id: "sunny", fx: [{ k: "up", e: ["🌻", "☀️", "🎈"] }, { k: "cannons" }] }
];

let fxTimers = [], curTheme = 0;

function every(ms, fn, dur) {
  fn();
  const t0 = Date.now(), id = setInterval(() => { if (dur && Date.now() - t0 > dur) return clearInterval(id); fn(); }, ms);
  fxTimers.push(id);
}

const FX = {
  cannons: () => every(60, () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, zIndex: 2000 });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, zIndex: 2000 });
  }, 3000),
  gold: () => every(120, () => confetti({ particleCount: 3, angle: 90, spread: 180, origin: { x: Math.random(), y: 0 }, colors: ["#ffd700", "#fff3c4", "#b8860b"], gravity: .5, ticks: 400, zIndex: 2000 }), 6000),
  stars: () => every(150, () => confetti({ particleCount: 3, spread: 120, origin: { x: Math.random(), y: 0 }, shapes: ["star"], colors: ["#ffd54f", "#b39ddb", "#ffffff"], gravity: .4, scalar: 1.3, ticks: 400, zIndex: 2000 }), 6000),
  fireworks: () => every(750, () => confetti({ particleCount: 70, startVelocity: 28, spread: 360, ticks: 70, gravity: .8, origin: { x: rnd(.15, .85), y: rnd(.1, .5) }, colors: pick([["#ff2bd6", "#00e5ff", "#ffffff"], ["#ffd700", "#ff5252", "#ffffff"], ["#69f0ae", "#40c4ff", "#ffffff"]]), zIndex: 2000 }))
};

function floaters(list, dir) {
  const s = $("spot");
  for (let i = 0; i < 16; i++) {
    const b = el("span", dir === "up" ? "balloon" : "faller", list[i % list.length]);
    b.style.cssText = `--x:${rnd(0, 95)}%;--d:${rnd(9, 17)}s;--w:${-rnd(0, 14)}s;--s:${rnd(28, 62)}px`;
    s.prepend(b);
  }
}

function stopFx() {
  fxTimers.forEach(clearInterval); fxTimers = [];
  $("spot").querySelectorAll(".balloon,.faller").forEach(n => n.remove());
  if (confetti.reset) confetti.reset();
}

function applyTheme(key, idx) {
  curTheme = idx != null ? idx : hash(key) % THEMES.length;
  const t = THEMES[curTheme];
  $("spot").dataset.theme = t.id;
  stopFx();
  t.fx.forEach(f => (f.k === "up" || f.k === "down") ? floaters(f.e, f.k) : FX[f.k]());
}

function board() {
  applyTheme(null, 0);
  const t = $("tarp"), grid = el("div", "tp-grid");
  t.replaceChildren(...grommets());
  spotList.forEach((b, i) => {
    const c = el("button", "tp-card");
    c.append(el("strong", null, b.name), el("span", null, b.noY ? b.tag : `Turns ${b.turns}`));
    c.addEventListener("click", () => slide(i));
    grid.appendChild(c);
  });
  t.append(el("div", "tp-script", "Happy Birthday!"), el("div", "tp-ribbon", "to all of today’s celebrants"), el("p", "tp-hint", "Click a name to see their birthday banner"), grid);
  replay(t);
}

function slide(i, idx) {
  const b = spotList[i];
  applyTheme(`${b.id}-${new Date().getFullYear()}`, idx);
  const t = $("tarp"), len = b.name.length, s = len <= 8 ? 15 : len <= 12 ? 11 : len <= 18 ? 8 : 6;
  t.replaceChildren(...grommets());
  const name = el("h2", "tp-name", b.name); name.style.fontSize = `${s}vmin`;
  const age = el("div", "tp-age"); if (b.noY) age.append(el("b", null, "🎂")); else age.append(el("b", null, String(b.turns)), el("small", null, "years old"));
  t.append(el("div", "tp-script", "Happy Birthday!"), name, age, el("div", "tp-ribbon", "Wishing you a day as special as you are!"), el("span", "tp-tag", b.tag));
  const acts = el("div", "tp-actions"), g = el("button", "tp-greet", "Send greeting");
  g.addEventListener("click", () => greet(b));
  acts.appendChild(g);
  const sh = el("button", "tp-greet", "🎲 New design");
  sh.addEventListener("click", () => slide(i, (curTheme + 1 + Math.floor(Math.random() * (THEMES.length - 1))) % THEMES.length));
  acts.appendChild(sh);
  if (document.body.classList.contains("is-admin")) {
    const cb = el("button", "tp-greet", "📅 Add to calendar");
    cb.addEventListener("click", () => downloadIcs([b], `${b.name}-birthday`));
    acts.appendChild(cb);
  }
  if (spotList.length > 1) {
    const back = el("button", "tp-back", "← All celebrants");
    back.addEventListener("click", board);
    acts.appendChild(back);
  }
  t.appendChild(acts);
  replay(t);
}

function openSpot(list) {
  if (!list.length) return;
  spotList = list;
  if (list.length > 1) board(); else slide(0);
  $("spot").hidden = false; document.body.style.overflow = "hidden";
  $("spot-close").focus();
}

function closeSpot() { $("spot").hidden = true; document.body.style.overflow = ""; stopFx(); }

$("spot-close").addEventListener("click", closeSpot);

$("spot-btn").addEventListener("click", () => {
  const all = compute(), today = all.filter(b => b.days === 0);
  if (today.length) return openSpot(today);
  const up = all.filter(b => b.days > 0);
  if (!up.length) return toast("No birthdays listed yet.");
  const min = Math.min(...up.map(b => b.days));
  openSpot(up.filter(b => b.days === min));
});

addEventListener("keydown", e => { if (e.key === "Escape" && !$("spot").hidden) closeSpot(); });

export { openSpot };
