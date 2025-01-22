// src/AuthContext.js
import { auth } from './api/firebaseInit';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getBackendJwtToken, authenticateWithBackendJwt } from './utils/authUtils';

// Create the AuthContext
const AuthContext = createContext();

// Hook to access auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Step 1: Check for backend JWT token and authenticate
        const backendJwtToken = getBackendJwtToken();
        if (backendJwtToken) {
          console.log('Backend JWT found, attempting authentication...');
          await authenticateWithBackendJwt(backendJwtToken);
          console.log('Authentication with backend JWT succeeded');
        } else {
          console.warn('No backend JWT token found');
        }

        // Step 2: Set up Firebase auth state listener
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        });

        return unsubscribe; // Return unsubscribe function for cleanup
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setIsLoading(false);
      }
    };

    const unsubscribePromise = initAuth();

    // Cleanup on component unmount
    return () => {
      unsubscribePromise?.then((unsubscribe) => unsubscribe?.());
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
