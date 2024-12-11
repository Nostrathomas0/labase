// NavBar.js

import React, { useEffect, useState } from 'react';
import Auth from '../Auth';
import { Link } from 'react-router-dom';

const NavCorner = ({ onLogout }) => {
  // Get the authenticated user state using the useAuthState hook
  const user = Auth.useAuthState();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  // Whenever user changes, update the state
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Function to handle clicking on the status indicator
  const handleStatusClick = async () => {
    if (user) {
      try {
        const progress = { lastUpdated: new Date().toISOString() };
        await Auth.updateJwtProgress(progress); // Update progress using the Auth.js function
        console.log("User progress updated successfully");
      } catch (error) {
        console.error("Error updating user progress:", error);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Languapps</Link>
      </div>
      <div className="navbar-links">
        <Link to="/A1">Beginner (A1)</Link>
        <Link to="/A2">Elementary (A2)</Link>
        <Link to="/B1">Pre-Intermediate (B1)</Link>
        <Link to="/B2">Intermediate (B2)</Link>
      </div>
      <div className="navbar-user">
        {isLoggedIn ? (
          <>
            <div className="status-indicator logged-in" onClick={handleStatusClick} title="Click to update progress" />
            <button className="nav-button logout-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <div className="status-indicator not-logged-in" title="Not logged in" />
            <Link className="nav-button login-link" to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavCorner;
