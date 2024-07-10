import React, { useState } from 'react';
import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext to provide the current user

const firestore = getFirestore();

const ScoreManager = ({ children }) => {
  const [score, setScore] = useState(0);
  const { currentUser } = useAuth();

  const incrementScore = (points) => {
    const newScore = score + points;
    setScore(newScore);
  };

  const saveScore = async () => {
    const authToken = document.cookie.split(';').find(row => row.trim().startsWith('authToken='))?.split('=')[1];
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      const newTokenPayload = { ...decodedToken, score: score };
      const newAuthToken = jwt.sign(newTokenPayload, process.env.REACT_APP_JWT_SECRET);

      document.cookie = `authToken=${newAuthToken}; max-age=3600; path=/; domain=.languapps.com; secure; samesite=none; httponly`;
      console.log('Auth token updated with new score:', newAuthToken);

      // Save the score to Firestore
      try {
        await setDoc(doc(firestore, 'users', currentUser.uid), { score: newScore }, { merge: true });
        console.log('Score saved to Firestore');
      } catch (error) {
        console.error('Error saving score to Firestore:', error);
      }
    } else {
      console.error('No auth token found.');
    }
  };

  return (
    <div>
      <h1>Current Score: {score}</h1>
      {children(incrementScore)}
      <button onClick={saveScore}>Save Score</button>
    </div>
  );
};

export default ScoreManager;
