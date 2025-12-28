// ProtectedRoute.js - Updated with Auto-Redirect to Last Session
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirected, setRedirected] = useState(false);
  const [sessionCheckComplete, setSessionCheckComplete] = useState(false);

  // Check for last session and auto-redirect (only on homepage)
  useEffect(() => {
    if (!loading && currentUser && location.pathname === '/' && !sessionCheckComplete) {
      try {
        const token = Cookies.get('JWT');
        
        if (token) {
          // Decode JWT manually (safer than jwt-decode library)
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Check if user has a session in progress
          if (payload.currentSession) {
            const { level, topic } = payload.currentSession;
            
            console.log(`Resuming last session: ${level}/${topic}`);
            
            // Small delay for better UX
            setTimeout(() => {
              navigate(`/${level}/${topic}`);
            }, 800);
          }
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        // Fail silently - don't break the app
      } finally {
        setSessionCheckComplete(true);
      }
    }
  }, [currentUser, loading, location.pathname, navigate, sessionCheckComplete]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !currentUser && !redirected) {
      setRedirected(true);
      navigate('/login', { state: { from: location } });
    }
  }, [currentUser, loading, navigate, location, redirected]);

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Return null during redirect to prevent additional renders
  if (!currentUser && redirected) {
    return null;
  }

  // Only render children if user is authenticated
  return currentUser ? children : null;
};

export default ProtectedRoute;