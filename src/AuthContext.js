// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({ user: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const backendJwtToken = Cookies.get('backendJwtToken');
    console.log('AuthContext - Retrieved backendJwtToken:', backendJwtToken);

    if (backendJwtToken) {
      try {
        const decodedToken = jwtDecode(backendJwtToken);
        console.log('AuthContext - Decoded JWT Token:', decodedToken);
        setUser({ email: decodedToken.email });
      } catch (error) {
        console.error('AuthContext - Error decoding JWT token:', error);
        setUser(null);
      }
    } else {
      console.warn('AuthContext - No backendJwtToken found.');
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
