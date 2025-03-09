// ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Only redirect if:
    // 1. We're not already loading
    // 2. We don't have a user
    // 3. We haven't already redirected (this is key to prevent infinite loops)
    if (!loading && !currentUser && !redirected) {
      setRedirected(true); // Mark that we've initiated a redirect
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