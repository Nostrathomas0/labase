// MainHeader.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const MainHeader = ({ onToggleSidebar }) => {
  const { currentUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);

  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  const handleLogout = () => {
    // Clear JWT and redirect to main domain for sign out
    document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.languapps.com";
    window.location.href = "https://languapps.com";
  };

  return (
    <header className="main-header">
      <div className="header-left">
        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        {/* Logo */}
        <Link to="/" className="header-logo">
          Languapps
        </Link>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <>
            <span className="user-welcome">
              Welcome, {currentUser?.email?.split('@')[0] || 'User'}
            </span>
            <div className="status-indicator logged-in" title="Logged in" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="status-indicator not-logged-in" title="Not logged in" />
            <Link className="login-btn" to="/login">Login</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default MainHeader;