// Main app: renders the page, tabs, admin actions, theme toggle.
import { $, MONTHS, el, ls, toast } from "./utils.js";
import { GoogleAuthProvider, addDoc, auth, col, db, deleteDoc, doc, onAuthStateChanged, onSnapshot, signInWithPopup, signOut, updateDoc } from "./firebase.js";
import { compute, store } from "./data.js";
import { greet, greeting } from "./greeting.js";
import { addF, clearDate, editF, readDate, writeDate } from "./datefields.js";
import { openSpot } from "./tarpaulin.js";

let tab = "month", firstLoad = true, editId = null;

function view(all) {
  const n = new Date(), q = $("search").value.trim().toLowerCase(), tg = $("tag-filter").value;
  let list = all.filter(b => (!q || (b.name || "").toLowerCase().includes(q)) && (tg === "all" || b.tag === tg));
  if (tab === "month") list = list.filter(b => b.m === n.getMonth() + 1).sort((a, b) => (b.days === 0) - (a.days === 0) || a.d - b.d);
  else if (tab === "soon") list = list.filter(b => b.days <= 30).sort((a, b) => a.days - b.days);
  else list = list.sort((a, b) => a.days - b.days);
  return list;
}

function render() {
  const all = compute(), list = view(all), box = $("birthday-list"), n = new Date();
  box.replaceChildren();
  $("current-month-text").textContent = `Happy birthday to all celebrants this ${MONTHS[n.getMonth()]}!`;

  list.forEach(b => {
    const passed = tab === "month" && b.d < n.getDate();
    const row = el("div", "birthday-item" + (b.days === 0 ? " today" : "") + (passed ? " done" : ""));
    const info = el("div", "info"), nm = el("strong", null, (b.days === 0 ? "🎂 " : "") + b.name);
    nm.appendChild(el("span", "chip c-" + b.tag, b.tag));
    const sub = b.noY ? (b.days === 0 ? "Happy birthday!" : "") : b.days === 0 ? `Turns ${b.turns} today!` : passed ? `${b.age} years old` : `Turning ${b.turns}`;
    info.append(nm, el("span", "sub", sub));
    const when = el("div", "when", b.days === 0 ? "Today! 🎉" : passed ? "Done ✓" : b.days === 1 ? "Tomorrow!" : `${b.days} days`);
    const tile = el("div", "tile");
    tile.append(el("span", "tm", MONTHS[b.m - 1].slice(0, 3)), el("span", "td", String(b.d)));
    const act = el("div", "actions");
    const eb = el("button", "edit-btn", "Edit"), db_ = el("button", "delete-btn", "Delete");
    const sb = el("button", "spot-row", "Spotlight");
    sb.addEventListener("click", () => openSpot([b]));
    const gb = el("button", "greet-row", "Greet");
    gb.addEventListener("click", () => greet(b));
    eb.addEventListener("click", () => openEdit(b));
    db_.addEventListener("click", () => remove(b));
    act.append(eb, db_);
    const btns = el("div", "row-btns");
    btns.append(sb, gb, act);
    row.append(tile, info, when, btns);
    box.appendChild(row);
  });

  if (!list.length) {
    const msgs = { month: `No birthdays in ${MONTHS[n.getMonth()]}.`, soon: "No birthdays in the next 30 days.", all: "No birthdays listed yet." };
    const e = el("div", "empty");
    e.append(el("p", "big", "🎈"), el("p", null, ($("search").value || $("tag-filter").value !== "all") ? "No matches found." : msgs[tab]));
    box.appendChild(e);
  }
  subtitle(all);
  $("filters").hidden = all.length <= 10;
  todayCard(all);
  nextCard(all);
}

function subtitle(all) {
  const s = $("hero-subtitle");
  if (!all.length) return;
  const sorted = [...all].sort((a, b) => a.days - b.days), today = sorted.filter(b => b.days === 0);
  if (today.length) s.textContent = `🎉 Happy birthday, ${today.map(b => b.name).join(" and ")}!`;
  else { const nx = sorted[0]; s.textContent = `🎂 Next: ${nx.name}, ${nx.days === 1 ? "tomorrow" : `in ${nx.days} days`}!`; }
}

const QUOTES = ["“Hope all your birthday wishes come true!”", "“It’s your special day, so get out there and celebrate!”", "“I hope your celebration gives you many happy memories!”", "“Happy birthday! Here’s to more life, love, and adventures to come!”", "“Wishing you a birthday that’s just as wonderful as you are!”"];

let qi = Math.floor(Date.now() / 6e4) % QUOTES.length;

const quoteEl = $("quote");

quoteEl.textContent = QUOTES[qi];

setInterval(() => {
  qi = (qi + 1) % QUOTES.length;
  quoteEl.style.opacity = 0;
  setTimeout(() => { quoteEl.textContent = QUOTES[qi]; quoteEl.style.opacity = 1; }, 300);
}, 60000);

function nextCard(all) {
  const c = $("next-card"), up = all.filter(b => b.days > 0);
  if (!up.length) { c.hidden = true; return; }
  const min = Math.min(...up.map(b => b.days)), group = up.filter(b => b.days === min), f = group[0];
  const line = el("span", "nc-line");
  line.append("Next birthday: ", el("strong", null, group.map(x => x.name).join(", ")), `, ${min === 1 ? "tomorrow" : `in ${min} days`} (${MONTHS[f.m - 1]} ${f.d})`);
  c.replaceChildren(el("span", "nc-emoji", "🎂"), line);
  c.hidden = false;
  c.onclick = () => openSpot(group);
}

function todayCard(all) {
  const c = $("today-card"), t = all.filter(b => b.days === 0);
  if (!t.length) { c.hidden = true; return; }
  const txt = el("div", "tc-text"), btns = el("div", "tc-btns");
  txt.append(el("span", "tc-label", t.length > 1 ? "Today’s celebrants" : "Today’s celebrant"),
    el("strong", "tc-name", t.map(b => b.name).join(" and ")),
    el("span", "tc-sub", t.length > 1 || t[0].noY ? "Happy birthday! 🎉" : `Turns ${t[0].turns} today! 🎉`));
  const sp = el("button", "tc-spot", "🎂 Open spotlight");
  sp.addEventListener("click", () => openSpot(t));
  btns.appendChild(sp);
  if (t.length === 1) { const g = el("button", "tc-greet", "Send greeting"); g.addEventListener("click", () => greet(t[0])); btns.appendChild(g); }
  c.replaceChildren(txt, btns);
  c.hidden = false;
}

onSnapshot(col, snap => {
  store.items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
  if (firstLoad) {
    firstLoad = false;
    const all = compute();
    openSpot(all.filter(b => b.days === 0));
  }
}, () => { $("birthday-list").replaceChildren(el("div", "empty", "Couldn't load the list. Please try again later.")); });

function setTab(name) {
  tab = name;
  document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", x.dataset.tab === name));
  render();
}

document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

$("search").addEventListener("input", render);

$("tag-filter").addEventListener("change", render);

const syncHash = () => document.body.classList.toggle("show-auth", location.hash === "#admin");

syncHash(); addEventListener("hashchange", syncHash);

if (auth) onAuthStateChanged(auth, u => {
  document.body.classList.toggle("is-admin", !!u);
  $("auth-btn").textContent = u ? "Logout" : "Admin login";
  if (!u && tab === "all") setTab("month");
});

$("auth-btn").addEventListener("click", async () => {
  if (!auth) return toast("Login unavailable. Open the site over https (e.g. GitHub Pages), not from a file.");
  if (auth.currentUser) { await signOut(auth); return toast("Logged out."); }
  try { await signInWithPopup(auth, new GoogleAuthProvider()); toast("Logged in."); }
  catch (e) {
    if (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request") return;
    toast(e.code === "auth/unauthorized-domain" ? "Add this domain to Authorized domains in Firebase." : "Login failed. Please try again.");
  }
});

const guard = async fn => {
  try { await fn(); return true; }
  catch (e) { toast(e.code === "permission-denied" ? "No permission. Please log in first." : "Something went wrong. Please try again."); return false; }
};

$("add-btn").addEventListener("click", async () => {
  const name = $("nameInput").value.trim(), date = readDate(addF), tag = $("tagInput").value;
  if (!name || !date) return toast("Enter a name and date.");
  if (await guard(() => addDoc(col, { name, date, tag }))) {
    $("nameInput").value = ""; clearDate(addF);
    confetti({ particleCount: 100, spread: 70, origin: { y: .6 }, colors: ["#ff6b9d", "#4a90e2", "#ffd700"] });
    toast("Added.");
  }
});

function openEdit(b) {
  editId = b.id; $("edit-name").value = b.name; writeDate(editF, b.date); $("edit-tag").value = b.tag;
  $("edit-dialog").showModal();
}

$("edit-cancel").addEventListener("click", () => $("edit-dialog").close());

$("edit-form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = $("edit-name").value.trim(), date = readDate(editF), tag = $("edit-tag").value;
  if (!name || !date) return toast("Enter a name and a valid date.");
  if (await guard(() => updateDoc(doc(db, "birthdays", editId), { name, date, tag }))) { $("edit-dialog").close(); toast("Saved."); }
});

async function remove(b) {
  if (confirm(`Delete ${b.name}?`) && await guard(() => deleteDoc(doc(db, "birthdays", b.id)))) toast("Deleted.");
}

const root = document.documentElement;

const dark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

const paintTheme = () => { $("theme-btn").textContent = dark() ? "☀️" : "🌙"; };

$("theme-btn").addEventListener("click", () => { const t = dark() ? "light" : "dark"; root.dataset.theme = t; ls.set("theme", t); paintTheme(); });

paintTheme();
