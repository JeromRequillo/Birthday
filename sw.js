// Network-first for code (so updates show up right away), cache-first for images.
const CACHE = "birthday-v3";
const PRECACHE = ["./", "index.html", "404.html", "manifest.json", "css/base.css", "css/components.css", "css/tarpaulin.css",
  "js/boot.js", "js/app.js", "js/utils.js", "js/firebase.js", "js/data.js", "js/greeting.js", "js/datefields.js",
  "js/calendar.js", "js/tarpaulin.js", "assets/favicon.ico", "assets/icons/icon-192.png", "assets/icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(PRECACHE.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // Firebase, fonts and CDN go straight to the network
  const code = req.mode === "navigate" || /\.(html|js|css|json)$/.test(url.pathname) || url.pathname.endsWith("/");
  e.respondWith(code ? networkFirst(req) : cacheFirst(req));
});
async function networkFirst(req) {
  try {
    const res = await fetch(req, { cache: "no-cache" });
    if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
    return res;
  } catch (err) {
    return (await caches.match(req)) || (req.mode === "navigate" && (await caches.match("index.html"))) || Response.error();
  }
}
async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
  return res;
}
