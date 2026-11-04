// Ready-made birthday greeting text and the share / copy button.
import { $, toast } from "./utils.js";

function greeting(b) {
  if (b.days === 0) return `Happy birthday, ${b.name}! 🎂🎉 Wishing you a day filled with love, laughter, and everything you wished for. Enjoy your special day!`;
  if (b.days >= 335) return `Happy belated birthday, ${b.name}! 🎂 Hope you had a wonderful day, and here’s to a great year ahead!`;
  return `Happy early birthday, ${b.name}! 🎂🎈 Can’t wait to celebrate with you. Wishing you a wonderful year ahead!`;
}

async function greet(b) {
  const text = greeting(b);
  try { if (navigator.share) { await navigator.share({ text }); return; } }
  catch (e) { if (e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(text); toast("Greeting copied. Paste it in a message!"); }
  catch (e) { toast("Couldn’t copy the greeting. Please try again."); }
}

export { greet, greeting };
