import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';



const firebaseConfig = {
 apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log('Firebase App Initialized:', app.name); // Should log '[DEFAULT]'

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  console.log("🔥 Firebase Emulator connected!", auth);
}


// Enable session persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("🔥 Firebase Auth Persistence Set"))
  .catch((error) => console.error("Auth Persistence Error:", error));

// 👉 Connect Firebase Authentication to Emulator
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("🔥 Firebase Emulator connected!");
}

export { app, db, auth };