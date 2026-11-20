// AuthContext.js
// Who is signed in, for the whole app.
//
// Identity comes from Firebase Auth (same accounts as languapps.com).
// The user's profile, including `premium` and `bookedClasses`, is read live
// from Firestore users/{uid}, so changes made in the console or by the Stripe
// webhook apply immediately, with no sign-out needed.
//
// Transition: if there is no Firebase session but a valid JWT cookie from
// languapps.com, that JWT is still accepted (read-only, as before). Remove
// this fallback once progress no longer uses the JWT.

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseInit';
import { jwtDecode } from 'jwt-decode';
import { getJwtToken, clearJwtToken } from '../utils/authUtils';

const AuthContext = createContext(null);

// Installed home-screen app: popups are unreliable there, so Google sign-in redirects instead
const isStandaloneApp = () =>
  typeof window !== 'undefined' &&
  ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true);

// A JWT cookie from languapps.com, if present and not expired (transition only)
const readJwtUser = async () => {
  try {
    const token = await getJwtToken(0);
    if (!token) return null;
    const payload = jwtDecode(token);
    if (!payload.uid || (payload.exp && payload.exp * 1000 < Date.now())) {
      clearJwtToken();
      return null;
    }
    return {
      uid: payload.uid,
      email: payload.email || '',
      displayName: '',
      premium: payload.premium === true,
      isJwtUser: true,
    };
  } catch (error) {
    clearJwtToken();
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(undefined); // undefined = not known yet
  const [profile, setProfile] = useState(null);                // users/{uid} document data
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [jwtUser, setJwtUser] = useState(null);
  const [jwtChecked, setJwtChecked] = useState(false);

  // Firebase session (persists across app restarts)
  useEffect(() => {
    if (!auth) {
      setFirebaseUser(null);
      return undefined;
    }
    getRedirectResult(auth).catch((error) => {
      console.warn('Google sign-in redirect failed:', error.code || error.message);
    });
    return onAuthStateChanged(auth, (user) => setFirebaseUser(user || null));
  }, []);

  // Transition: JWT cookie from the website
  useEffect(() => {
    readJwtUser().then((user) => {
      setJwtUser(user);
      setJwtChecked(true);
    });
  }, []);

  // Live profile from Firestore for the signed-in Firebase user
  useEffect(() => {
    setProfile(null);
    setProfileLoaded(false);
    if (!firebaseUser || !db) {
      setProfileLoaded(true);
      return undefined;
    }
    return onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (snap) => {
        setProfile(snap.exists() ? snap.data() : {});
        setProfileLoaded(true);
      },
      (error) => {
        console.warn('Could not read user profile:', error.code || error.message);
        setProfile({});
        setProfileLoaded(true);
      }
    );
  }, [firebaseUser]);

  const currentUser = useMemo(() => {
    if (firebaseUser) {
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        premium: !!(profile && profile.premium === true),
        bookedClasses: (profile && profile.bookedClasses) || [],
        isJwtUser: false,
      };
    }
    return jwtUser;
  }, [firebaseUser, profile, jwtUser]);

  // Signed-in state is known as soon as Firebase answers (works offline).
  // The Firestore profile can arrive later; only premium checks wait for it.
  const loading = firebaseUser === undefined || !jwtChecked;
  const profileLoading = !!firebaseUser && !profileLoaded;

  // ── Actions ─────────────────────────────────────────────
  const signInWithEmail = useCallback(
    (email, password) => signInWithEmailAndPassword(auth, email.trim(), password),
    []
  );

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    if (isStandaloneApp()) return signInWithRedirect(auth, provider);
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(error.code)) {
        return signInWithRedirect(auth, provider);
      }
      throw error;
    }
  }, []);

  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email.trim()), []);

  const signOut = useCallback(async () => {
    clearJwtToken();
    setJwtUser(null);
    if (auth && auth.currentUser) await firebaseSignOut(auth);
  }, []);

  const value = {
    currentUser,
    userEmail: currentUser ? currentUser.email : '',
    isAuthenticated: !!currentUser,
    loading,
    profileLoading,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
