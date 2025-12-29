// ProtectedRoute.js - AGGRESSIVE INSTANT REDIRECT VERSION
// Gets users OFF the welcome page and INTO lessons IMMEDIATELY
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

  // AGGRESSIVE AUTO-REDIRECT - Get users to lessons IMMEDIATELY
  useEffect(() => {
    if (!loading && currentUser && !sessionCheckComplete) {
      // Don't redirect if already on a lesson page
      const isOnLessonPage = location.pathname.match(/^\/(A1|A2|B1|B2)\//);
      
      if (!isOnLessonPage) {
        try {
          const token = Cookies.get('JWT');
          
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            let targetUrl = null;
            
            // Priority 1: Resume current session if exists
            if (payload.currentSession) {
              const { level, topic } = payload.currentSession;
              targetUrl = `/${level}/${topic}`;
              console.log('🚀 SNAP BACK to current session:', targetUrl);
            }
            // Priority 2: Go to most recent completed lesson
            else if (payload.recentProgress && payload.recentProgress.length > 0) {
              const recent = payload.recentProgress[0];
              targetUrl = `/${recent.level}/${recent.topic}`;
              console.log('🚀 SNAP BACK to recent lesson:', targetUrl);
            }
            // Priority 3: Default to first lesson
            else {
              targetUrl = '/A1/nouns';
              console.log('🚀 SNAP BACK to default start:', targetUrl);
            }
            
            // INSTANT redirect - no delay, no mercy
            navigate(targetUrl, { replace: true });
          }
        } catch (error) {
          console.error('Redirect failed:', error);
        } finally {
          setSessionCheckComplete(true);
        }
      } else {
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