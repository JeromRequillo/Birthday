# 🎂 Birthday Tracker & Greeting Page

A real-time birthday wall for family and friends. It tracks birthdays, counts down to the next one, and gives every
celebrant a full-screen **tarpaulin spotlight** with its own design and effects.

**Live site:** https://jeromrequillo.github.io/Birthday/

## Features

- **Live data** with Firebase Firestore. Everyone sees updates instantly.
- **Spotlight tarpaulin:** 8 designs (Classic, Fiesta, Royal, Sweet, Neon, Tropical, Galaxy, Sunny), picked per celebrant, each with different effects. Use the 🎲 button for a new design.
- **Today card** for the celebrant of the day, plus a small "next birthday" line.
- **Optional birth year.** Choose "Year unknown" and no age is shown.
- **Greeting button** that shares or copies a ready-made message.
- **Calendar export (.ics)** with yearly repeating birthdays and reminders (admin).
- **Admin login with Google.** Only the account allowed by the Firestore rules can add, edit or delete.
- Dark mode, installable on phones (PWA), works offline for the page shell.

## Project structure

```
index.html            page markup
404.html              friendly "not found" page
manifest.json         install-to-home-screen settings
sw.js                 service worker (network-first, so updates show up right away)
css/                  base.css, components.css, tarpaulin.css
js/                   app.js (entry), firebase.js, data.js, utils.js, datefields.js,
                      greeting.js, calendar.js, tarpaulin.js, boot.js
assets/               favicon, app icons, social preview image
docs/                 SETUP.md and screenshots
```

## Run locally

The scripts are ES modules, so open the site through a local server instead of double-clicking the file:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Set up your own copy

See [docs/SETUP.md](docs/SETUP.md) for the Firebase, security rules and GitHub Pages steps.

## License

MIT. See [LICENSE](LICENSE).
