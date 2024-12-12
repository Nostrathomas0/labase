import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve the JWT token from cookies
    const token = Cookies.get('backendJwtToken');
    console.log('Retrieved token from cookies:', token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);

        // Check if the token is expired
        if (decodedToken.exp < Date.now() / 1000) {
          console.warn('Token expired');
          Cookies.remove('backendJwtToken');
          setCurrentUser(null);
          setJwtToken(null);
        } else {
          setJwtToken(token);
          setCurrentUser(decodedToken); // Set the user to the decoded token payload
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        Cookies.remove('backendJwtToken');
      }
    } else {
      console.log('No token found in cookies');
    }

    setIsLoading(false); // Authentication check complete
  }, []);

  return (
    <AuthContext.Provider value={{ user: currentUser, jwtToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
