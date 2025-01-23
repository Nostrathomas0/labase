import { auth } from '../api/firebaseInit'; // Import initialized auth instance
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

// Hook to monitor authentication state changes
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

// Authenticate with a backend JWT
export const authenticateWithBackendJwt = async (backendJwtToken) => {
  try {
    const decodedToken = jwtDecode(backendJwtToken);
    console.log('Decoded JWT:', decodedToken);

    await signInWithCustomToken(auth, backendJwtToken);
    console.log('User authenticated successfully with backend JWT.');
  } catch (error) {
    console.error('Error authenticating with backend JWT:', error);
    throw error;
  }
};

// Export only what’s needed
export { auth };
