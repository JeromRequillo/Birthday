// Firebase setup: Firestore, optional Google sign-in. Edit the config here.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyCRl2LQBqPUc7uCqJp6sSwPSF6o-9dKb9w",
  authDomain: "birthday-tracker-dff7f.firebaseapp.com",
  projectId: "birthday-tracker-dff7f",
  storageBucket: "birthday-tracker-dff7f.firebasestorage.app",
  messagingSenderId: "796866393410",
  appId: "1:796866393410:web:c548cf89c5df9cb9ef04db",
  measurementId: "G-7TPQ3R4JTP"
});

const db = getFirestore(app);

let auth = null, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged;

try {
  const a = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js");
  ({ signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = a);
  auth = a.getAuth(app);
} catch (e) { console.error("Auth unavailable:", e); }

const col = collection(db, "birthdays");

export { GoogleAuthProvider, addDoc, app, auth, col, db, deleteDoc, doc, onAuthStateChanged, onSnapshot, signInWithPopup, signOut, updateDoc };
