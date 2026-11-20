// src/views/LoginPage.js
// Route: /login — sign in with email/password or Google (same accounts as languapps.com).
// New accounts are created on languapps.com (sign-up there includes bot protection);
// Google sign-in creates the account on first use.

import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const SIGN_UP_URL = 'https://languapps.com/?openModal=auth-modal';

// Firebase error codes → messages a student understands
const friendlyError = (error) => {
  switch (error && error.code) {
    case 'auth/invalid-email':
      return 'That email address doesn\'t look right.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes, or reset your password.';
    case 'auth/network-request-failed':
      return 'No connection. Check your internet and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return '';
    case 'auth/unauthorized-domain':
      return 'Google sign-in isn\'t enabled for this address yet.';
    default:
      return 'Sign-in didn\'t work. Please try again.';
  }
};

const LoginPage = () => {
  const { currentUser, loading, signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const from = (location.state && location.state.from && location.state.from.pathname) || '/';

  if (!loading && currentUser) return <Navigate to={from} replace />;

  const run = async (action) => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    run(() => signInWithEmail(email, password));
  };

  const handleReset = () => {
    if (!email.trim()) {
      setError('Enter your email above, then tap "Forgot password?" again.');
      return;
    }
    run(async () => {
      await resetPassword(email);
      setNotice(`If an account exists for ${email.trim()}, a reset link is on its way.`);
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/icons/icon-192.png" alt="" className="login-logo" width="72" height="72" />
        <h1 className="login-title">Sign in to Languapps</h1>

        <button
          type="button"
          className="login-google"
          onClick={() => run(signInWithGoogle)}
          disabled={busy || loading}
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" />
            <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" />
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.8 6C6.6 42.6 14.6 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        <div className="login-divider"><span>or</span></div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            required
          />

          {error && <p className="login-error" role="alert">{error}</p>}
          {notice && <p className="login-notice" role="status">{notice}</p>}

          <button type="submit" className="login-submit" disabled={busy || loading}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <button type="button" className="login-link" onClick={handleReset} disabled={busy}>
          Forgot password?
        </button>

        <p className="login-signup">
          New to Languapps? <a href={SIGN_UP_URL}>Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
