import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
    apiKey: "AIzaSyA_bq5-hmAlNbK-2ZgHSFl0Iew4uphF_Eo",
    authDomain: "languapps.firebaseapp.com",
    projectId: "languapps",
    storageBucket: "languapps.appspot.com",
    messagingSenderId: "866735367707",
    appId: "1:866735367707:web:6154b4ab63fcab0272fabe",
    measurementId: "G-MCZY61SSMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log('Firebase App Initialized:', app.name); // Should log '[DEFAULT]'

export { app, db, auth };