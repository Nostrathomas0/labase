// src/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getBackendJwtToken, authenticateWithBackendJwt } from './utils/authUtils';

// Create the AuthContext
const AuthContext = createContext();

// Export the useAuth hook at the top level
export const useAuth = () => {
  return useContext(AuthContext);  // This hook provides the context's value
};

// AuthProvider component that provides the auth context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const backendJwtToken = getBackendJwtToken();

        if (backendJwtToken) {
          await authenticateWithBackendJwt(backendJwtToken);
        }

        // Initialize auth and listen for auth state changes
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error during authentication:', error);
        setIsLoading(false);
      }
    };

    authenticate();
  }, []); // Empty dependency array ensures it runs once after component mounts

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
