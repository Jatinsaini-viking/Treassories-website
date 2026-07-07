/* =========================================================
   TREASSORIES — Firebase configuration
   ---------------------------------------------------------
   This is the ONLY file you need to edit to make login /
   sign-up actually work. Everything else is already wired up.
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyA-jtkRcqiKl0M1ioEJyxSm0vZxO6xcmmo",
  authDomain: "trassories.firebaseapp.com",
  projectId: "trassories",
  storageBucket: "trassories.firebasestorage.app",
  messagingSenderId: "424187790809",
  appId: "1:424187790809:web:63bf32a63c3c27822085c8"
};

// Don't touch below this line.
try {
  firebase.initializeApp(firebaseConfig);
} catch (e) {
  console.warn('Firebase not configured yet — auth buttons will show an error until you add your keys in firebase-config.js', e);
}
