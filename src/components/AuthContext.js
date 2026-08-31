// AuthContext.js
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseInit';
import { getJwtToken, authenticateWithJwt, clearJwtToken } from '../utils/authUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const authInProgress = useRef(false);
  const jwtAuthSuccess = useRef(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (authInProgress.current) return;
      authInProgress.current = true;

      try {
        // Priority 1: JWT
        const token = await getJwtToken();
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            console.warn("JWT token expired, clearing");
            clearJwtToken();
            authInProgress.current = false;
          } else {
            const decodedToken = await authenticateWithJwt();
            const jwtUser = {
              uid: decodedToken.uid,
              email: decodedToken.email,
              isJwtUser: true
            };
            setCurrentUser(jwtUser);
            setUserEmail(decodedToken.email || '');
            setLoading(false);
            jwtAuthSuccess.current = true;

            // Auto refresh
            const timeUntilExpiry = (payload.exp * 1000) - Date.now();
            const refreshTime = timeUntilExpiry - (10 * 60 * 1000);
            if (refreshTime > 0) {
              setTimeout(async () => {
                try {
                  await authenticateWithJwt();
                } catch (error) {
                  console.error('Auto refresh failed:', error);
                }
              }, refreshTime);
            }

            authInProgress.current = false;
            return;
          }
        }
      } catch (error) {
        console.error('JWT Authentication failed:', error);
        clearJwtToken();
        jwtAuthSuccess.current = false;
        authInProgress.current = false;
      }

      // Priority 2: Firebase fallback — only if auth is available
      if (!jwtAuthSuccess.current) {
        if (!auth) {
          // Firebase unavailable — JWT-only mode, settle cleanly
          console.log("Firebase unavailable, JWT-only mode");
          setCurrentUser(null);
          setLoading(false);
          authInProgress.current = false;
          return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setCurrentUser(user);
            setUserEmail(user.email || '');
          } else {
            setCurrentUser(null);
            setUserEmail('');
          }
          setLoading(false);
          authInProgress.current = false;
        });

        return unsubscribe;
      }
    };

    const cleanup = checkAuthentication();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  useEffect(() => {
    console.log("Auth state:", loading ? "Loading" : (currentUser ? "Authenticated" : "Not authenticated"));
  }, [loading, currentUser]);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};