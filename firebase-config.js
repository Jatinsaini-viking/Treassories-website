/* =========================================================
   ZEVAR — Firebase configuration
   ---------------------------------------------------------
   This is the ONLY file you need to edit to make login /
   sign-up actually work. Everything else is already wired up.

   HOW TO GET THESE VALUES (takes about 5 minutes, free):
   1. Go to https://console.firebase.google.com and sign in
      with any Google account.
   2. Click "Add project" → give it any name (e.g. "zevar") →
      finish the setup wizard.
   3. On the project's home page, click the "</>" (web) icon
      to register a web app. Give it a nickname and click
      "Register app".
   4. Firebase will show you a `firebaseConfig` object — copy
      each value into the matching field below.
   5. In the left sidebar go to Build → Authentication →
      "Get started", then in the "Sign-in method" tab enable:
        - Email/Password
        - Google
        - Facebook   (needs an App ID + App Secret from
                       developers.facebook.com — free account)
        - Phone      (Note: Firebase requires you to be on the
                       "Blaze" pay-as-you-go plan for Phone
                       sign-in in production. You still won't
                       be charged unless people actually verify
                       real phone numbers, and each SMS costs a
                       few paisa — but Firebase does ask you to
                       link a card to enable it. Email, Google
                       and Facebook stay 100% free with no card.)
   6. Add your live domain (and localhost, for testing) under
      Authentication → Settings → Authorized domains.
========================================================= */

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

// Don't touch below this line.
try {
  firebase.initializeApp(firebaseConfig);
} catch (e) {
  console.warn('Firebase not configured yet — auth buttons will show an error until you add your keys in firebase-config.js', e);
}
