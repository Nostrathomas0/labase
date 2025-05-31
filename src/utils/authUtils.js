import Cookies from 'js-cookie';
import { auth } from '../firebaseInit';
import { signInWithCustomToken } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';

console.log("Firebase Auth:", auth);

/**
 * Retrieve the JWT token from cookies.
 * @returns {string|null} - The JWT token if found, otherwise null.
 */
export const getJwtToken = () => {
  // Check for JWT cookie (our standardized name)
  const token = Cookies.get('JWT');
  console.log('Retrieved JWT from storage:', token ? 'Found' : 'Not found');
  return token || null;
};

/**
 * Set the JWT token in cookies only (standardized approach)
 * @param {string} token - The JWT token to store
 */
export const setJwtToken = (token) => {
  if (token) {
    // Set only JWT cookie (our standardized name)
    Cookies.set('JWT', token, { 
      secure: window.location.protocol === 'https:', 
      sameSite: 'strict',
      expires: 7, // 7 days
      domain: window.location.hostname.includes('languapps.com') ? '.languapps.com' : undefined
    });
    console.log('JWT token saved to storage');
  } else {
    clearJwtToken();
  }
};

/**
 * Clear the JWT token from storage
 */
export const clearJwtToken = () => {
  // Clear JWT cookie (our standardized name)
  Cookies.remove('JWT', { 
    domain: window.location.hostname.includes('languapps.com') ? '.languapps.com' : undefined 
  });
  
  console.log('JWT token cleared from storage');
};

/**
 * Authenticate the user using the JWT token.
 * @returns {Promise<void>} - Resolves if authentication succeeds.
 */
export const authenticateWithJwt = async () => {
  try {
    const token = getJwtToken();
    if (!token) {
      throw new Error('No JWT token found in storage.');
    }

    const decodedToken = jwtDecode(token);
    console.log('Decoded JWT:', decodedToken);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.error('JWT token has expired');
      clearJwtToken();
      throw new Error('JWT token has expired');
    }

    // Use shared `auth` instance to sign in
    await signInWithCustomToken(auth, token);
    console.log('User authenticated successfully with JWT.');
    return decodedToken;
  } catch (error) {
    console.error('Error during JWT authentication:', error);
    clearJwtToken(); // Clear invalid token
    throw error;
  }
};

/**
 * Backward compatibility functions
 */
export const getBackendJwtToken = getJwtToken;
export const authenticateWithBackendJwt = authenticateWithJwt;

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
    console.log('Retrieved user ID token:', token ? 'Found' : 'Not found');
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
    const token = await auth.currentUser.getIdToken(true); // Force refresh the token
    console.log('User token refreshed successfully');
    return token;
  } catch (error) {
    console.error('Error refreshing user token:', error);
    throw error;
  }
};