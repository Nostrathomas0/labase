// src/api/checkAccess.js
import admin from 'firebase-admin';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import express from 'express';


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

const app = express();
const db = getFirestore();
// Middleware to verify Firebase ID token from cookies
async function verifyToken(req, res, next) {
  const idToken = req.cookies.authToken; // Assuming the token is stored in a cookie named 'authToken'

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

app.use(express.json());
app.use(require('cookie-parser')()); // For parsing cookies

app.get('/api/check-access', verifyToken, async (req, res) => {
  const { uid } = req;
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists() && userDoc.data().accessGranted) {
      res.json({ accessGranted: true });
    } else {
      res.json({ accessGranted: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to check access' });
  }
});

export default app;
