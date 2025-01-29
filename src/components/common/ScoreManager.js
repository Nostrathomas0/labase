import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../api/firebaseInit'; // Ensure this is initialized before use
import jwtDecode from 'jwt-decode';

const db = getFirestore(); // ✅ Use the initialized Firebase app

/**
 * Retrieve the user's progress for a given grammar page.
 * @param {string} userId - Firebase user ID.
 * @param {string} pageId - Grammar page ID.
 * @returns {Promise<Object>} - User progress.
 */
export const getProgress = async (userId, pageId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    return progressSnap.exists()
      ? progressSnap.data()[pageId] || { completedQuestions: 0, lastAccessed: null }
      : { completedQuestions: 0, lastAccessed: null };
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw new Error('Unable to fetch progress');
  }
};

/**
 * Update the user's progress for a given grammar page.
 * @param {string} userId - Firebase user ID.
 * @param {string} pageId - Grammar page ID.
 * @param {Object} progress - Progress data (e.g., completed questions & timestamp).
 */
export const updateProgress = async (userId, pageId, progress) => {
  try {
    if (!userId || !pageId || !progress) throw new Error("Missing required parameters");

    const progressRef = doc(db, 'userProgress', userId);
    const progressSnap = await getDoc(progressRef);

    await setDoc(progressRef, { [pageId]: progress }, { merge: progressSnap.exists() });

    // Update JWT with new progress
    await updateJwtProgress(userId, progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    throw new Error('Unable to update progress');
  }
};

/**
 * Updates the JWT progress on the backend.
 * @param {string} userId - Firebase user ID.
 * @param {Object} progress - Progress data.
 */
const updateJwtProgress = async (userId, progress) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const token = await user.getIdToken();
    const decodedToken = jwtDecode(token);

    const newJwtPayload = { ...decodedToken, progress };
    
    // 🔹 TODO: Replace with actual API call
    await fetch('https://your-backend-api.com/update-jwt', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newJwtPayload })
    });

    console.log('Request to backend to update JWT:', newJwtPayload);
  } catch (error) {
    console.error('Error updating JWT with progress:', error);
  }
};

/**
 * Tracks and updates user progress.
 * @param {string} pageId - Grammar page ID.
 */
export const trackProgress = async (pageId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const progress = await getProgress(user.uid, pageId);
    console.log(`Current progress for ${pageId}:`, progress);

    const updatedProgress = {
      completedQuestions: progress.completedQuestions + 1,
      lastAccessed: new Date().toISOString(),
    };

    await updateProgress(user.uid, pageId, updatedProgress);
    console.log(`Updated progress for ${pageId}:`, updatedProgress);
  } catch (error) {
    console.error('Error tracking progress:', error);
  }
};

/**
 * Export functions for external use.
 */
const ScoreManager = { getProgress, updateProgress, trackProgress };
export default ScoreManager;
