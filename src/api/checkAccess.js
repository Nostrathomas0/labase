// src/api/checkAccess.js

import admin from 'firebase-admin';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import express from 'express';
import { decodeToken } from '../utils/authUtils';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();
const db = getFirestore();

app.use(express.json());
app.use(require('cookie-parser')());

async function verifyToken(req, res, next) {
  const idToken = req.cookies.authToken;

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = decodeToken(idToken);
    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/api/check-access', verifyToken, async (req, res) => {
  const { uid } = req;
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    res.json({ accessGranted: userDoc.exists() && userDoc.data().accessGranted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check access' });
  }
});

export default app;
