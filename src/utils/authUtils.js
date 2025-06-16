import Cookies from 'js-cookie';
import { auth } from '../firebaseInit';
import { jwtDecode } from 'jwt-decode';

console.log("Firebase Auth:", auth);

const getJwtTokenManual = () => {
  const cookies = document.cookie.split(';');
  const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('JWT='));
  return jwtCookie ? decodeURIComponent(jwtCookie.split('=')[1]) : null;
};

/**
 * Retrieve the JWT token from cookies with retry logic.
 * @param {number} retries - Number of retries if cookie not found
 * @returns {string|null} - The JWT token if found, otherwise null.
 */
export const getJwtToken = (retries = 3) => {
  console.log('All cookies raw:', document.cookie);
  
  // Try js-cookie first
  let token = Cookies.get('JWT');
  console.log('js-cookie result:', token);
  
  // If js-cookie fails, try manual reading
  if (!token) {
    token = getJwtTokenManual();
    console.log('Manual cookie reading result:', token);
  }
  
  // If still no token and we have retries left, wait a bit and try again
  if (!token && retries > 0) {
    console.log(`No token found, retrying... (${retries} attempts left)`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getJwtToken(retries - 1));
      }, 100); // Wait 100ms and try again
    });
  }
  
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
    const cookieOptions = { 
      secure: window.location.protocol === 'https:', 
      sameSite: 'strict',
      expires: 7, // 7 days
      path: '/', // Make sure path is set
    };
    
    // Only set domain if on languapps.com
    if (window.location.hostname.includes('languapps.com')) {
      cookieOptions.domain = '.languapps.com';
    }
    
    Cookies.set('JWT', token, cookieOptions);
    console.log('JWT token saved to storage with options:', cookieOptions);
    
    // Verify it was set
    setTimeout(() => {
      const verification = Cookies.get('JWT');
      console.log('JWT verification after save:', verification ? 'Found' : 'Not found');
    }, 50);
  } else {
    clearJwtToken();
  }
};

/**
 * Clear the JWT token from storage
 */
export const clearJwtToken = () => {
  const removeOptions = { 
    path: '/'
  };
  
  // Only set domain if on languapps.com
  if (window.location.hostname.includes('languapps.com')) {
    removeOptions.domain = '.languapps.com';
  }
  
  Cookies.remove('JWT', removeOptions);
  console.log('JWT token cleared from storage');
};

/**
 * Authenticate the user using the JWT token with async support.
 * @returns {Promise<Object>} - Resolves with decoded token if authentication succeeds.
 */
export const authenticateWithJwt = async () => {
  try {
    // Get token with async support for retries
    const token = await getJwtToken();
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