// Auth.js - Comprehensive Update for Managing Authentication and State
import { app } from '../api/firebaseInit';
import { jwtDecode } from 'jwt-decode';
import { getAuth, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import axios from 'axios'; // For backend requests to update JWT

const auth = getAuth(app);

/**
 * Hook to monitor authentication state changes and provide user state.
 * @returns {Object} - The current authenticated user or null if not authenticated.
 */
export const useAuthState = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
};

/**
 * Function to authenticate a user using a backend JWT token.
 * @param {string} backendJwtToken - The JWT token provided by the backend.
 * @returns {Promise<void>} - Resolves if the user is authenticated successfully.
 */
export const authenticateWithJwt = async (backendJwtToken) => {
  try {
    // Decode the JWT token to extract payload data (optional)
    const decodedToken = jwtDecode(backendJwtToken);
    console.log('Decoded JWT:', decodedToken);

    // Sign in the user with the provided JWT token using Firebase's custom token method
    await signInWithCustomToken(auth, backendJwtToken);
    console.log('User signed in successfully');
  } catch (error) {
    console.error('Error authenticating with JWT:', error);
    throw new Error('Unable to authenticate with the provided JWT token');
  }
};

/**
 * Function to check if the current user is authenticated.
 * @returns {boolean} - True if the user is authenticated, false otherwise.
 */
export const isAuthenticated = () => {
  const user = auth.currentUser;
  return !!user;
};

/**
 * Function to get the authenticated user's token.
 * @returns {Promise<string>} - Resolves to the user's ID token.
 */
export const getUserToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found');
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error fetching user token:', error);
    throw new Error('Unable to get user token');
  }
};

/**
 * Function to refresh the user's JWT token. This may be necessary when the server issues new claims.
 * @returns {Promise<void>} - Resolves if the refresh is successful.
 */
export const refreshUserToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.getIdToken(true); // Force refresh the token
      console.log('User token refreshed successfully');
    } else {
      throw new Error('No authenticated user found to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing user token:', error);
    throw new Error('Unable to refresh user token');
  }
};

/**
 * Function to update the JWT progress by calling a backend API.
 * @param {Object} progress - The progress data to embed in the JWT.
 * @returns {Promise<void>} - Resolves if the backend JWT is updated successfully.
 */
export const updateJwtProgress = async (progress) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found to update JWT progress');
    }
    const token = await user.getIdToken();

    // Make a backend request to update JWT, including progress data
    const response = await axios.post('https://your-backend-api.com/update-jwt', {
      userId: user.uid,
      progress,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log('JWT updated successfully with progress');
    } else {
      console.error('Failed to update JWT progress:', response.status);
    }
  } catch (error) {
    console.error('Error updating JWT with progress:', error);
    throw new Error('Unable to update JWT with progress');
  }
};

/**
 * Exporting Auth object for managing authentication state.
 */
const Auth = {
  authenticateWithJwt,
  isAuthenticated,
  getUserToken,
  refreshUserToken,
  useAuthState,
  updateJwtProgress,
};

export default Auth;
