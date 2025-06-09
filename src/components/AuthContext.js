// AuthContext.js
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseInit';
import { getJwtToken, authenticateWithJwt, clearJwtToken } from '../utils/authUtils';

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
    
    // Check for JWT first, then Firebase as fallback
    const checkAuthentication = async () => {
      if (authAttempted.current) return;
      authAttempted.current = true;

      try {
        // Priority 1: Check for JWT token
        const token = getJwtToken();
        console.log("JWT token found:", !!token);
        
        if (token) {
          console.log("Attempting JWT authentication");
          const decodedToken = await authenticateWithJwt();
          
          // JWT authentication successful
          const jwtUser = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            isJwtUser: true
          };
          
          console.log("JWT authentication successful:", jwtUser);
          setCurrentUser(jwtUser);
          setUserEmail(decodedToken.email || '');
          setLoading(false);
          return; // Exit early - we have JWT auth
        }
      } catch (error) {
        console.error('JWT Authentication failed:', error);
        clearJwtToken(); // Clear invalid JWT
      }

      // Priority 2: Check Firebase auth (fallback only)
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Firebase auth state:", user ? "User logged in" : "No user");
        
        if (user) {
          console.log("Using Firebase user as fallback");
          setCurrentUser(user);
          setUserEmail(user.email || '');
        } else {
          console.log("No authentication found");
          setCurrentUser(null);
          setUserEmail('');
        }
        setLoading(false);
      });

      // Cleanup function
      return unsubscribe;
    };

    const cleanup = checkAuthentication();
    
    // Clean up Firebase listener if it was created
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
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