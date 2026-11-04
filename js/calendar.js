// Calendar export (.ics) with yearly repeating birthdays and reminders.
import { $, el, pad, toast } from "./utils.js";
import { compute } from "./data.js";

function fold(line) {
  const enc = new TextEncoder(); let out = "", cur = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (cur + n > 74) { out += "\r\n "; cur = 1; }
    out += ch; cur += n;
  }
  return out;
}

const icsEsc = s => String(s).replace(/[\\;,]/g, "\\$&").replace(/\n/g, "\\n");

function icsDay(dt) { return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`; }

function downloadIcs(list, name) {
  const n = new Date(), today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const stamp = n.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Birthday Tracker//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Birthdays"];
  list.forEach(b => {
    const leapDay = b.m === 2 && b.d === 29, at = y => leapDay ? new Date(y, 2, 0) : new Date(y, b.m - 1, b.d);
    let dt = at(today.getFullYear());
    if (dt < today) dt = at(today.getFullYear() + 1);
    const end = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1), title = `${b.name}’s birthday`;
    lines.push("BEGIN:VEVENT", `UID:${b.id}@birthday-tracker`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDay(dt)}`, `DTEND;VALUE=DATE:${icsDay(end)}`,
      leapDay ? "RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1" : "RRULE:FREQ=YEARLY",
      `SUMMARY:${icsEsc("🎂 " + title)}`, "TRANSP:TRANSPARENT",
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(title + " is tomorrow")}`, "TRIGGER:-PT15H", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(title + " is today")}`, "TRIGGER:PT9H", "END:VALARM",
      "END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.map(fold).join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
  const a = el("a"); a.href = URL.createObjectURL(blob); a.download = name.replace(/[^\w-]+/g, "_") + ".ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast("Calendar file downloaded. Open it to add the reminders.");
}

$("cal-btn").addEventListener("click", () => {
  if (!document.body.classList.contains("is-admin")) return;
  const all = compute();
  if (!all.length) return toast("No birthdays listed yet.");
  downloadIcs(all, "birthdays");
});

export { downloadIcs };
