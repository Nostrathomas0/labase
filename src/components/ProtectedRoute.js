// assets/js/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { jwtToken, isLoading } = useAuth();
  const location = useLocation();

  // Wait until loading is complete to proceed
  if (isLoading) return <div>Loading...</div>;

  if (!jwtToken) {
    // Redirect if no token is found
    return <Navigate to="/login" state={{ from: location }} />;
  }

  try {
    const decodedToken = jwtDecode(jwtToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // Token expired, redirect to login
      return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" state={{ from: location }} />;
  }
};

export default ProtectedRoute;
