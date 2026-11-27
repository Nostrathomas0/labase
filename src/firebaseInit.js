import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
} from 'firebase/firestore';

// On Firebase Hosting (staging.languapps.com), sign-in redirects are handled by
// the site itself (/__/auth/handler). Keeping them on the app's own domain makes
// Google sign-in work in Safari and in the installed home-screen app.
const host = typeof window !== 'undefined' ? window.location.hostname : '';
const onFirebaseHosting =
  host === 'staging.languapps.com' || host.endsWith('.web.app') || host.endsWith('.firebaseapp.com');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: onFirebaseHosting ? window.location.host : process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let db = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  // Keep a copy of the user's Firestore data on the device, so the profile
  // (premium) is known offline and records written offline sync later
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  auth = getAuth(app);

  setPersistence(auth, browserLocalPersistence)
    .catch((error) => console.error("Auth Persistence Error:", error));

  if (window.location.hostname === "localhost") {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
  }
} catch (error) {
  console.warn("Firebase initialization failed — the app will run without sign-in:", error.message);
}

export { app, db, auth };
