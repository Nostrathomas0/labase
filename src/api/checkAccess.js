import express from 'express';
import { db } from './firebaseInit'; // Import centralized admin and db
import { decodeToken } from '../utils/authUtils';

const app = express();

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
    const userDoc = await db.collection('users').doc(uid).get(); // Admin SDK syntax
    res.json({ accessGranted: userDoc.exists && userDoc.data().accessGranted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check access' });
  }
});

export default app;
