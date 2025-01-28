// scoreManager.js - Updated to Read/Write Progress with JWT Support

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../api/firebaseInit';
import jwtDecode from 'jwt-decode';

const db = getFirestore();

/**
 * Function to get the user's progress for a given grammar page.
 * @param {string} userId - The user ID from Firebase Authentication.
 * @param {string} pageId - The grammar page ID to track progress.
 * @returns {Promise<Object>} - Resolves to the user's progress data.
 */
export const getProgress = async (userId, pageId) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const progressData = progressSnap.data();
      return progressData[pageId] || { completedQuestions: 0, lastAccessed: null };
    } else {
      return { completedQuestions: 0, lastAccessed: null };
    }
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw new Error('Unable to fetch progress');
  }
};

/**
 * Function to update the user's progress for a given grammar page.
 * @param {string} userId - The user ID from Firebase Authentication.
 * @param {string} pageId - The grammar page ID to track progress.
 * @param {Object} progress - The progress data to save (e.g., completedQuestions and timestamp).
 */
export const updateProgress = async (userId, pageId, progress) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      await setDoc(progressRef, { [pageId]: progress }, { merge: true });
    } else {
      await setDoc(progressRef, { [pageId]: progress });
    }

    // Update JWT to store progress data
    await updateJwtProgress(userId, progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    throw new Error('Unable to update progress');
  }
};

/**
 * Function to update JWT progress.
 * This assumes there is a server-side function to handle JWT update via a secure endpoint.
 * @param {string} userId - The user ID.
 * @param {Object} progress - The progress data to embed in the JWT.
 */
const updateJwtProgress = async (userId, progress) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const decodedToken = jwtDecode(token);
    const newJwtPayload = {
      ...decodedToken,
      progress,
    };
    
    // Here you would send a request to a backend endpoint to regenerate the JWT
    // e.g., using fetch or axios, including userId and newJwtPayload
    console.log('Request to backend to update JWT:', newJwtPayload);
    
    // Placeholder for actual request to AWS Lambda or backend function
  } catch (error) {
    console.error('Error updating JWT with progress:', error);
  }
};

/**
 * Function to get the current user and track progress accordingly.
 * Calls the appropriate functions to either update or get progress.
 * @param {string} pageId - The grammar page ID.
 */
export const trackProgress = async (pageId) => {
  const user = auth.currentUser;
  if (!user) {
    console.error('No authenticated user found');
    return;
  }

  try {
    // Fetch existing progress for the user and page.
    const progress = await getProgress(user.uid, pageId);
    console.log(`Current progress for ${pageId}:`, progress);

    // Example: Increment completed questions.
    const updatedProgress = {
      completedQuestions: progress.completedQuestions + 1,
      lastAccessed: new Date().toISOString(),
    };

    // Update the user's progress in Firestore and update the JWT.
    await updateProgress(user.uid, pageId, updatedProgress);
    console.log(`Updated progress for ${pageId}:`, updatedProgress);
  } catch (error) {
    console.error('Error tracking progress:', error);
  }
};

/**
 * Exporting the functions as named exports.
 */
export default {
  getProgress,
  updateProgress,
  trackProgress,
};