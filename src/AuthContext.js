// assets/js/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebaseInit';
import Cookies from 'js-cookie';

const AuthContext = createContext({ user: null, jwtToken: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          
          // Set the JWT token as a cookie for cross-domain access
          Cookies.set('authToken', token, {
            domain: '.languapps.com',
            path: '/',
            secure: true,
            sameSite: 'lax',
          });

          setJwtToken(token);
          console.log("JWT Token set in context and as cookie:", token);
        } catch (error) {
          console.error("Error retrieving JWT token:", error);
          setJwtToken(null);
        }
      } else {
        // Clear JWT token if user signs out
        Cookies.remove('authToken', { domain: '.languapps.com', path: '/' });
        setJwtToken(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: currentUser, jwtToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
