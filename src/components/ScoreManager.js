import React, { useState } from 'react';
import jwtDecode from 'jwt-decode';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const firestore = getFirestore();

const ScoreManager = ({ children }) => {
  const [score, setScore] = useState(0);
  const { currentUser } = useAuth();

  const incrementScore = (points) => {
    setScore(score + points);
  };

  const saveScore = async () => {
    const backendJwtToken = document.cookie.split(';').find(row => row.trim().startsWith('backendJwtToken='))?.split('=')[1];
    
    if (backendJwtToken) {
      const decodedToken = jwtDecode(backendJwtToken);
      console.log('Token decoded with current payload:', decodedToken);

      // Save the score to Firestore
      try {
        await setDoc(doc(firestore, 'users', currentUser.uid), { score: score }, { merge: true });
        console.log('Score saved to Firestore');
      } catch (error) {
        console.error('Error saving score to Firestore:', error);
      }
    } else {
      console.error('No backend JWT token found.');
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
