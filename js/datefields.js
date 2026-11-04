// Date inputs with the optional "Year unknown" mode.
import { $, MONTHS, pad } from "./utils.js";

const DF = w => ({ date: w.querySelector("input[type=date]"), md: w.querySelector(".md"), m: w.querySelector(".m"), d: w.querySelector(".d"), cb: w.querySelector(".noyr input") });

const addF = DF($("add-date")), editF = DF($("edit-datefield"));

const showMode = f => { f.date.hidden = f.cb.checked; f.md.hidden = !f.cb.checked; };

[addF, editF].forEach(f => {
  MONTHS.forEach((x, i) => f.m.add(new Option(x, i + 1)));
  for (let i = 1; i <= 31; i++) f.d.add(new Option(i, i));
  f.cb.addEventListener("change", () => showMode(f));
});

function readDate(f) {
  if (!f.cb.checked) return f.date.value || null;
  const m = +f.m.value, d = +f.d.value;
  if (!m || !d || new Date(2024, m - 1, d).getMonth() !== m - 1) return null;
  return `0000-${pad(m)}-${pad(d)}`;
}

function writeDate(f, date) {
  const [y, m, d] = date.split("-").map(Number);
  f.cb.checked = y === 0; showMode(f);
  if (y === 0) { f.m.value = m; f.d.value = d; f.date.value = ""; } else f.date.value = date;
}

function clearDate(f) { f.cb.checked = false; showMode(f); f.date.value = ""; f.m.value = ""; f.d.value = ""; }

export { addF, clearDate, editF, readDate, writeDate };
