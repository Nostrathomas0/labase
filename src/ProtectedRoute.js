// src/components/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = () => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('authToken='));
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token.split('=')[1]);
      return decodedToken && decodedToken.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  };

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
