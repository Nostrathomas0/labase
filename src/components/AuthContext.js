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
  const authInProgress = useRef(false);
  const jwtAuthSuccess = useRef(false); // Track if JWT auth was successful

  useEffect(() => {
    console.log("AuthContext useEffect running");
    
    // Check for JWT first, then Firebase as fallback
    const checkAuthentication = async () => {
      if (authInProgress.current) return;
      authInProgress.current = true;

      try {
        // Priority 1: Check for JWT token
        const token = await getJwtToken(); // FIXED: Added await
        console.log("JWT token found:", !!token);
        console.log("DEBUG - Token type:", typeof token);
        console.log("DEBUG - Token value:", token);
        console.log("DEBUG - Is string?", typeof token === 'string');
        
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            console.warn("JWT token expired, clearing token");
            clearJwtToken(); // Clear expired JWT
            authInProgress.current = false;
          } else {
            console.log("JWT token is valid, proceeding with authentication");
            const decodedToken = await authenticateWithJwt();
            const jwtUser = {
              uid: decodedToken.uid,
              email: decodedToken.email,
              isJwtUser: true
            };
            
            console.log("JWT authentication successful:", jwtUser);
            setCurrentUser(jwtUser);
            setUserEmail(decodedToken.email || '');
            setLoading(false);
            jwtAuthSuccess.current = true;

            // Set up auto refresh
            const timeUntilExpiry = (payload.exp * 1000) - Date.now();
            const refreshTime = timeUntilExpiry - (10 * 60 * 1000); // 10 min before expiry

            if (refreshTime > 0) {
              setTimeout(async () => {
                try {
                  await authenticateWithJwt(); // This should refresh the token
                } catch (error) {
                  console.error('Auto refresh failed:', error);
                }
              }, refreshTime);
            }

            authInProgress.current = false;
            return; // Exit early - we have JWT auth
          }
        }
      } catch (error) {
        console.error('JWT Authentication failed:', error);
        clearJwtToken(); // Clear invalid JWT
        jwtAuthSuccess.current = false;
        authInProgress.current = false;
      }

      // Priority 2: Check Firebase auth (only if JWT failed)
      if (!jwtAuthSuccess.current) {
        console.log("No JWT auth, checking Firebase...");
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log("Firebase auth state:", user ? "User logged in" : "No user");
          
          if (user) {
            console.log("Using Firebase user");
            setCurrentUser(user);
            setUserEmail(user.email || '');
          } else {
            console.log("No authentication found");
            setCurrentUser(null);
            setUserEmail('');
          }
          setLoading(false);
          authInProgress.current = false;
        });

        // Return cleanup function
        return unsubscribe;
      } else {
        console.log("JWT auth successful, skipping Firebase check");
        authInProgress.current = false;
      }
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