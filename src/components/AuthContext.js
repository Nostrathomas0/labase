// AuthContext.js
// Who is signed in, for the whole app.
//
// Identity comes from Firebase Auth (same accounts as languapps.com).
// The user's profile, including `premium` and `bookedClasses`, is read live
// from Firestore users/{uid}, so changes made in the console or by the Stripe
// webhook apply immediately, with no sign-out needed.
//
// Coming from languapps.com: the website sends the user to the app with a
// one-time Firebase custom token in the address (#handoff=...). The app signs
// in with it and removes it from the address straight away.

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseInit';

const AuthContext = createContext(null);

// Installed home-screen app: popups are unreliable there, so Google sign-in redirects instead
const isStandaloneApp = () =>
  typeof window !== 'undefined' &&
  ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true);

// One-time sign-in token from languapps.com, read once when the app loads.
// It is taken out of the address at once so it is never bookmarked or shared.
const takeHandoffToken = () => {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/(?:^#|&)handoff=([^&]+)/);
  if (!match) return null;
  const rest = window.location.hash
    .replace(/^#/, '')
    .split('&')
    .filter((part) => !part.startsWith('handoff='))
    .join('&');
  window.history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search + (rest ? `#${rest}` : '')
  );
  return decodeURIComponent(match[1]);
};

const initialHandoffToken = takeHandoffToken();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(undefined); // undefined = not known yet
  const [profile, setProfile] = useState(null);                // users/{uid} document data
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [handoffPending, setHandoffPending] = useState(!!initialHandoffToken);

  // Firebase session (persists across app restarts)
  useEffect(() => {
    if (!auth) {
      setFirebaseUser(null);
      return undefined;
    }
    getRedirectResult(auth).catch((error) => {
      console.warn('Google sign-in redirect failed:', error.code || error.message);
    });
    if (initialHandoffToken) {
      signInWithCustomToken(auth, initialHandoffToken)
        .catch((error) => console.warn('Sign-in from the website failed:', error.code || error.message))
        .finally(() => setHandoffPending(false));
    }
    return onAuthStateChanged(auth, (user) => setFirebaseUser(user || null));
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
      };
    }
    return null;
  }, [firebaseUser, profile]);

  // Signed-in state is known as soon as Firebase answers (works offline).
  // The Firestore profile can arrive later; only premium checks wait for it.
  const loading = firebaseUser === undefined || handoffPending;
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
