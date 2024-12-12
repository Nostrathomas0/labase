// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Auth from './components/Auth.js'; // Import the Auth module
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const authenticate = async () => {
      const backendJwtToken = Cookies.get('backendJwtToken');
      console.log('Retrieved backendJwtToken from cookies:', backendJwtToken);

      if (backendJwtToken) {
        try {
          // Authenticate using the JWT token
          await Auth.authenticateWithJwt(backendJwtToken);
          console.log('User authenticated with JWT');
        } catch (error) {
          console.error('Authentication failed:', error);
        }
      }

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    authenticate();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
