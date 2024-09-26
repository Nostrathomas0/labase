/*
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
*/

const ProtectedRoute = ({ children }) => {
  // Temporary: Bypass the token validation logic for development purposes
  // Uncomment the logic below to reinstate protection
  
  /*
  const location = useLocation();
  const authToken = document.cookie.split(';').find(row => row.trim().startsWith('authToken='))?.split('=')[1];

  if (!authToken) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  try {
    const decodedToken = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // Token expired
      return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" state={{ from: location }} />;
  }
  */

  return children;  // Allow access to all routes temporarily
};

export default ProtectedRoute;