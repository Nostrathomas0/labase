// MainHeader.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const MainHeader = ({ onToggleSidebar, progressManager }) => {
  const { currentUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [currentScore, setCurrentScore] = useState(null);
  const [overallStats, setOverallStats] = useState(null);

  // Your existing useEffect
useEffect(() => {
  setIsLoggedIn(!!currentUser);
}, [currentUser]);

// ADD THIS NEW useEffect:
useEffect(() => {
  if (!isLoggedIn || !progressManager) return;

  const updateScores = () => {
    const pageProgress = progressManager.getPageProgress();
    setCurrentScore(pageProgress);
    const stats = progressManager.getOverallStats();
    setOverallStats(stats);
  };

  updateScores();
  const interval = setInterval(updateScores, 2000);
  return () => clearInterval(interval);
}, [isLoggedIn, progressManager]);

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
            {progressManager && (
        <div className="header-score-display">
          {currentScore && currentScore.totalQuestions > 0 && (
            <div className="header-current-score">
              <span className="score-icon">📝</span>
              <span className="score-text">
                {currentScore.correctAnswers}/{currentScore.totalQuestions}
                <span className="score-percent"> ({currentScore.score}%)</span>
              </span>
            </div>
          )}
          {overallStats && overallStats.totalTopicsCompleted > 0 && (
            <div className="header-overall-stats">
              <span className="stat-item">
                <span className="stat-icon">📚</span>
                <span className="stat-value">{overallStats.totalTopicsCompleted}</span>
              </span>
              <span className="stat-divider">|</span>
              <span className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">{overallStats.averageScore}%</span>
              </span>
              {overallStats.streak > 0 && (
                <>
                  <span className="stat-divider">|</span>
                  <span className="stat-item">
                    <span className="stat-icon">🔥</span>
                    <span className="stat-value">{overallStats.streak}</span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
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