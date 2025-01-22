// components/Auth.js - Comprehensive Update for Managing Authentication and State


import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

/**
 * Hook to monitor authentication state changes and provide user state.
 * @returns {Object} - The current authenticated user or null if not authenticated.
 */
export const useAuthState = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
};

/**
 * Exporting only unique functionality.
 */
const Auth = {
  useAuthState,
};

export default Auth;