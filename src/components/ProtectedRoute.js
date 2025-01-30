// assets/js/ProtectedRoute.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useAuth } from '.AuthContext';

const ProtectedRoute = ({ children }) => {
  const { jwtToken, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!jwtToken) {
        // No token found, navigate to login
        navigate('/login', { state: { from: location } });
      } else {
        try {
          const decodedToken = jwtDecode(jwtToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Token expired, navigate to login
            navigate('/login', { state: { from: location } });
          }
        } catch (error) {
          console.error("Invalid token", error);
          navigate('/login', { state: { from: location } });
        }
      }
    }
  }, [jwtToken, isLoading, navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
