// Shared data store and the birthday calculations (days left, age, next birthday).
import { $, occurrence } from "./utils.js";

const store = { items: [] };

function compute() {
  const n = new Date(), today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  return store.items.filter(b => /^\d{4}-\d{2}-\d{2}$/.test(b.date || "")).map(b => {
    const [y, m, d] = b.date.split("-").map(Number), noY = y === 0;
    let yr = today.getFullYear(), occ = occurrence(yr, m, d);
    if (occ < today) { yr++; occ = occurrence(yr, m, d); }
    const days = Math.round((occ - today) / 864e5), turns = noY ? null : yr - y;
    return { ...b, y, m, d, noY, days, turns, age: noY ? null : (days === 0 ? turns : turns - 1), tag: b.tag || "Others" };
  });
}

export { compute, store };
