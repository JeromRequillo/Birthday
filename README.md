# 🎂 Birthday Tracker & Greeting Page

A vibrant, interactive, and real-time web application designed to track and celebrate birthdays for family and friends. This project features a clean "Sticky Note" aesthetic, dynamic animations, and cloud-themed backgrounds, all powered by a live database.

## 🚀 Live Demo

You can view the live project here: **https://jeromrequillo.github.io/Birthday/**

---

## ✨ Features

* **Real-Time Data:** Integrated with **Firebase Firestore** to ensure all birthday entries are updated instantly across all devices.
* **Smart Monthly Filtering:** The app automatically detects the current month and displays only the relevant celebrants, keeping the interface clutter-free.
* **Celebration Mode:** Features an automatic **Confetti Blast** (via Canvas-Confetti) whenever a birthday matches the current calendar date.
* **Time-Aware Greetings:** The subtitle dynamically changes based on the user's local time (Morning, Afternoon, or Evening greetings).
* **Admin Controls:** Includes a password-protected system (`Default: 1234`) to Add, Edit, or Delete entries, preventing unauthorized changes.
* **PWA Ready:** Includes service worker registration and manifest linking, allowing the site to be installed as a mobile app.
* **Responsive UI:** Fully optimized for Desktop, Tablet, and Mobile views.

---

## 🛠️ Technical Stack

| Component | Technology Used |
| --- | --- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Database** | Firebase Firestore (NoSQL) |
| **Animations** | CSS Keyframes & Canvas-Confetti API |
| **Fonts** | Google Fonts (Fredoka One, Quicksand) |
| **Deployment** | GitHub Pages |

---

## 🔑 Admin Credentials

To manage the list, the system will prompt for an admin password when trying to add, edit, or delete a name.

* **Default Password:** `1234`
* **How to change:** Locate the `addBirthday`, `editBirthday`, or `deleteBirthday` functions in the `<script>` tag and update the `pass === "1234"` condition.

---

## 📂 Project Structure

```text
├── index.html          # Main application file (Structure, Logic, and Styles)
├── manifest.json       # Configuration for Progressive Web App (PWA)
├── sw.js               # Service Worker for offline capabilities
└── README.md           # Project documentation

```

---

## ⚙️ Setup & Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/JeromRequillo/Birthday.git

```


2. **Firebase Configuration:**
The project is currently linked to a Firebase project. To use your own database:
* Create a project at [Firebase Console](https://console.firebase.google.com/).
* Enable **Firestore Database**.
* Copy your configuration object and replace the `firebaseConfig` constant in `index.html`.


3. **Deployment:**
* Push the code to your GitHub repository.
* Go to **Settings > Pages**.
* Select the `main` branch and click **Save**.



---

## 📜 License

This project is open-source. Feel free to fork, modify, and use it for your own personal birthday tracking needs.

---

## 👤 Developer

**JEROM REQUILLO**

* GitHub: [https://github.com/JeromRequillo)

---

*“Where every special day is remembered and celebrated.”*

---

### Would you like me to also generate the content for your `manifest.json` file to make sure the PWA (installable app) feature works correctly?
