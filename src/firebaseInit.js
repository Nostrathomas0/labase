import firebase from 'firebase/app';
import 'firebase/auth';

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
