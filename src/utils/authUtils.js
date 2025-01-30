import Cookies from 'js-cookie';
import { auth } from '../firebaseInit';  // ✅ Import shared auth instance
import { signInWithCustomToken } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';

/**
 * Retrieve the backend JWT token from cookies.
 * @returns {string|null} - The JWT token if found, otherwise null.
 */
export const getBackendJwtToken = () => {
  const token = Cookies.get('backendJwtToken');
  console.log('Retrieved backendJwtToken from cookies:', token);
  return token || null;
};

/**
 * Authenticate the user using the backend JWT token.
 * @returns {Promise<void>} - Resolves if authentication succeeds.
 */
export const authenticateWithBackendJwt = async () => {
  try {
    const token = getBackendJwtToken();
    if (!token) {
      throw new Error('No backend JWT token found in cookies.');
    }

    const decodedToken = jwtDecode(token);
    console.log('Decoded JWT:', decodedToken);
    console.log('🍪 All Cookies:', Cookies.get());

    // ✅ Use shared `auth` instance to sign in
    await signInWithCustomToken(auth, token);
    console.log('User authenticated successfully with backend JWT.');
  } catch (error) {
    console.error('Error during backend JWT authentication:', error);
    throw error;
  }
};

/**
 * Get the currently authenticated user's ID token.
 * @returns {Promise<string>} - Resolves to the user's ID token.
 */
export const getUserToken = async () => {
  if (!auth?.currentUser) {
    throw new Error('No authenticated user found.');
  }

  try {
    const token = await auth.currentUser.getIdToken();
    console.log('Retrieved user ID token:', token);
    return token;
  } catch (error) {
    console.error('Error retrieving user token:', error);
    throw error;
  }
};

/**
 * Refresh the authenticated user's ID token.
 * @returns {Promise<void>} - Resolves if the refresh is successful.
 */
export const refreshUserToken = async () => {
  if (!auth?.currentUser) {
    throw new Error('No authenticated user found to refresh token.');
  }

  try {
    await auth.currentUser.getIdToken(true); // Force refresh the token
    console.log('User token refreshed successfully.');
  } catch (error) {
    console.error('Error refreshing user token:', error);
    throw error;
  }
};
