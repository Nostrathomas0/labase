// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseInit';
import { 
  getJwtToken, 
  authenticateWithJwt, 
  clearJwtToken, 
  getBackendJwtToken 
} from '../utils/authUtils';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User authenticated from Firebase');
        setCurrentUser(user);
        setUserEmail(user.email || '');
      } else {
        // Try to authenticate with JWT if no Firebase user
        try {
          const token = getBackendJwtToken() || getJwtToken();
          if (token) {
            console.log('Attempting JWT authentication');
            await authenticateWithJwt();
            // If JWT auth is successful, the onAuthStateChanged will trigger again
          } else {
            setCurrentUser(null);
            setUserEmail('');
          }
        } catch (error) {
          console.error('JWT Authentication failed:', error);
          setCurrentUser(null);
          setUserEmail('');
          clearJwtToken();
        }
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

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