// AuthContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseInit';
import { getJwtToken, authenticateWithJwt } from '../utils/authUtils';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const authAttempted = useRef(false);

  useEffect(() => {
    console.log("AuthContext useEffect running");
    
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      
      if (user) {
        setCurrentUser(user);
        setUserEmail(user.email || '');
        setLoading(false);
      } else if (!authAttempted.current) {
        // Only try JWT auth once to prevent loops
        authAttempted.current = true;
        
        // Try to authenticate with JWT if no Firebase user
        try {
          const token = getJwtToken();
          console.log("JWT token found:", !!token);
          
          if (token) {
            console.log("Attempting JWT authentication");
            await authenticateWithJwt();
            // onAuthStateChanged will fire again if successful
          } else {
            setCurrentUser(null);
            setUserEmail('');
            setLoading(false);
          }
        } catch (error) {
          console.error('JWT Authentication failed:', error);
          setCurrentUser(null);
          setUserEmail('');
          setLoading(false);
        }
      } else {
        // We've already tried JWT auth and still no user
        setCurrentUser(null);
        setUserEmail('');
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth subscription");
      unsubscribe();
    };
  }, []);

  // Log auth state for debugging
  useEffect(() => {
    console.log("Auth state:", loading ? "Loading" : (currentUser ? "Authenticated" : "Not authenticated"));
  }, [loading, currentUser]);

  // Auth context value
  const value = {
    currentUser,
    userEmail,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};