import Cookies from 'js-cookie';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
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
  const auth = getAuth();

  try {
    const token = getBackendJwtToken();
    if (!token) {
      throw new Error('No backend JWT token found in cookies.');
    }

    // Optionally decode the token to inspect payload
    const decodedToken = jwtDecode(token);
    console.log('Decoded JWT:', decodedToken);

    // Sign in with the backend JWT using Firebase Authentication
    await signInWithCustomToken(auth, token);
    console.log('User authenticated successfully with backend JWT.');
  } catch (error) {
    console.error('Error during backend JWT authentication:', error);
    throw error;
  }
};
