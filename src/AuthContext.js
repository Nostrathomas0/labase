// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebaseInit';
import Cookies from 'js-cookie';

const AuthContext = createContext({ user: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        Cookies.set('backendJwtToken', token, {
          domain: '.languapps.com',
          path: '/',
          secure: true,
          sameSite: 'None',
        });
        setUser(firebaseUser);
      } else {
        setUser(null);
        Cookies.remove('backendJwtToken', { domain: '.languapps.com', path: '/' });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
