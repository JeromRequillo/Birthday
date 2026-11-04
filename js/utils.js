// Shared helpers: DOM shortcuts, month names, date math, toast.

const $ = id => document.getElementById(id);

const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };

const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const occurrence = (y, m, d) => (m === 2 && d === 29 && !isLeap(y)) ? new Date(y, 2, 1) : new Date(y, m - 1, d);

function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3000); }

const pad = n => String(n).padStart(2, "0");

const rnd = (a, b) => a + Math.random() * (b - a);

const hash = s => { let n = 0; for (const c of s) n = (n * 31 + c.codePointAt(0)) | 0; return Math.abs(n); };

const pick = a => a[Math.floor(Math.random() * a.length)];

export { $, MONTHS, el, hash, ls, occurrence, pad, pick, rnd, toast };
