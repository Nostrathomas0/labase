// HamburgerNavigation.js - Updated with Score Display
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const HamburgerNavigation = ({ isOpen, onClose, progressManager }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [currentScore, setCurrentScore] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const location = useLocation();

  // Update scores when menu opens or progress changes
 const updateScores = useCallback(() => { // ← Define FIRST
  if (!progressManager) return;
  const pageProgress = progressManager.getPageProgress();
  setCurrentScore(pageProgress);
  const stats = progressManager.getOverallStats();
  setOverallStats(stats);
}, [progressManager]);

useEffect(() => {
  if (isOpen && progressManager) {
    updateScores(); // ← Use SECOND
  }
}, [isOpen, progressManager, updateScores]); // ← Include ALL dependencies

  const handleSaveProgress = async () => {
    if (progressManager) {
      const success = await progressManager.saveProgress();
      if (success) {
        alert('Progress saved successfully!');
        updateScores(); // Refresh displayed scores
      } else {
        alert('Failed to save progress. Please try again.');
      }
    }
  };

  const handleCompletePage = async () => {
    if (progressManager) {
      const result = await progressManager.completePage();
      if (result.jwtUpdated) {
        alert(`Page completed! Score: ${result.score}%`);
        updateScores(); // Refresh displayed scores
        onClose(); // Close menu after completion
      } else {
        alert('Failed to complete page. Please try again.');
      }
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleLinkClick = () => {
    onClose();
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isActiveLevelSection = (level) => {
    return location.pathname.startsWith(`/${level}`);
  };

  return (
    <aside className={`hamburger-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        {/* Close button for mobile */}
        <button className="sidebar-close" onClick={onClose}>
          ×
        </button>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {/* Home */}
          <Link 
            to="/" 
            className={`nav-item ${isActiveRoute('/') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            🏠 Home
          </Link>

          {/* SCORE DISPLAY SECTION */}
          {progressManager && (
            <div className="nav-section score-display">
              <div className="nav-section-header">📊 Your Progress</div>
              
              {/* Current Page Score */}
              {currentScore && currentScore.totalQuestions > 0 && (
                <div className="score-card current-score">
                  <div className="score-label">Current Page</div>
                  <div className="score-value">
                    <span className="score-number">{currentScore.score}%</span>
                    <span className="score-details">
                      {currentScore.correctAnswers}/{currentScore.totalQuestions} correct
                    </span>
                  </div>
                  <div className={`score-status ${currentScore.passed ? 'passed' : 'not-passed'}`}>
                    {currentScore.passed ? '✅ Passing' : '⏳ In Progress'}
                  </div>
                </div>
              )}

              {/* Overall Statistics */}
              {overallStats && (
                <div className="score-card overall-stats">
                  <div className="stat-row">
                    <span className="stat-label">📚 Topics Completed:</span>
                    <span className="stat-value">{overallStats.totalTopicsCompleted}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">⭐ Average Score:</span>
                    <span className="stat-value">{overallStats.averageScore}%</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">🔥 Current Streak:</span>
                    <span className="stat-value">{overallStats.streak}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">⏱️ Total Time:</span>
                    <span className="stat-value">
                      {Math.floor(overallStats.totalTimeSpent / 60)} min
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Controls */}
          <div className="nav-section progress-controls">
            <div className="nav-section-header">💾 Actions</div>
            <div className="nav-subsection">
              <button 
                className="nav-item progress-btn save-btn"
                onClick={handleSaveProgress}
                disabled={!progressManager}
              >
                💾 Save Progress
              </button>
              <button 
                className="nav-item progress-btn complete-btn"
                onClick={handleCompletePage}
                disabled={!progressManager || !currentScore || currentScore.totalQuestions === 0}
              >
                ✅ Complete Page
              </button>
            </div>
          </div>

          {/* Grammar Lessons Section */}
          <div className="nav-section">
            <button 
              className="nav-section-header"
              onClick={() => toggleSection('grammar')}
            >
              📚 Grammar Lessons
              <span className={`chevron ${expandedSections.grammar ? 'expanded' : ''}`}>
                ▼
              </span>
            </button>
            
            {expandedSections.grammar && (
              <div className="nav-subsection">
                {/* A1 Level */}
                <div className="nav-level">
                  <button 
                    className={`nav-level-header ${isActiveLevelSection('A1') ? 'active' : ''}`}
                    onClick={() => toggleSection('A1')}
                  >
                    A1 - Beginner
                    <span className={`chevron ${expandedSections.A1 ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <Link 
                    to="/A1" 
                    className={`nav-level-overview ${isActiveRoute('/A1') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </Link>
                  
                  {expandedSections.A1 && (
                    <div className="nav-topics">
                      <Link 
                        to="/A1/nouns" 
                        className={`nav-topic ${isActiveRoute('/A1/nouns') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Nouns
                      </Link>
                      <Link 
                        to="/A1/adjectives" 
                        className={`nav-topic ${isActiveRoute('/A1/adjectives') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Adjectives
                      </Link>
                      <Link 
                        to="/A1/verbs" 
                        className={`nav-topic ${isActiveRoute('/A1/verbs') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Verbs
                      </Link>
                      <Link 
                        to="/A1/there" 
                        className={`nav-topic ${isActiveRoute('/A1/there') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        There Is/Are
                      </Link>
                    </div>
                  )}
                </div>

                {/* A2 Level */}
                <div className="nav-level">
                  <button 
                    className={`nav-level-header ${isActiveLevelSection('A2') ? 'active' : ''}`}
                    onClick={() => toggleSection('A2')}
                  >
                    A2 - Elementary
                    <span className={`chevron ${expandedSections.A2 ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <Link 
                    to="/A2" 
                    className={`nav-level-overview ${isActiveRoute('/A2') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </Link>
                  
                  {expandedSections.A2 && (
                    <div className="nav-topics">
                      <Link 
                        to="/A2/pastCont" 
                        className={`nav-topic ${isActiveRoute('/A2/pastCont') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Past Continuous
                      </Link>
                      <Link 
                        to="/A2/future" 
                        className={`nav-topic ${isActiveRoute('/A2/future') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Future Tense
                      </Link>
                      <Link 
                        to="/A2/goingTo" 
                        className={`nav-topic ${isActiveRoute('/A2/goingTo') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Going To
                      </Link>
                      <Link 
                        to="/A2/compSupe" 
                        className={`nav-topic ${isActiveRoute('/A2/compSupe') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Comparatives & Superlatives
                      </Link>
                    </div>
                  )}
                </div>

                {/* B1 Level */}
                <div className="nav-level">
                  <button 
                    className={`nav-level-header ${isActiveLevelSection('B1') ? 'active' : ''}`}
                    onClick={() => toggleSection('B1')}
                  >
                    B1 - Pre-Intermediate
                    <span className={`chevron ${expandedSections.B1 ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <Link 
                    to="/B1" 
                    className={`nav-level-overview ${isActiveRoute('/B1') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </Link>
                  
                  {expandedSections.B1 && (
                    <div className="nav-topics">
                      <Link 
                        to="/B1/presPerfCont" 
                        className={`nav-topic ${isActiveRoute('/B1/presPerfCont') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Present Perfect Continuous
                      </Link>
                      <Link 
                        to="/B1/pastPerfCont" 
                        className={`nav-topic ${isActiveRoute('/B1/pastPerfCont') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Past Perfect Continuous
                      </Link>
                      <Link 
                        to="/B1/2ndCond" 
                        className={`nav-topic ${isActiveRoute('/B1/2ndCond') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Second Conditional
                      </Link>
                      <Link 
                        to="/B1/modalVerbs" 
                        className={`nav-topic ${isActiveRoute('/B1/modalVerbs') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Modal Verbs
                      </Link>
                    </div>
                  )}
                </div>

                {/* B2 Level */}
                <div className="nav-level">
                  <button 
                    className={`nav-level-header ${isActiveLevelSection('B2') ? 'active' : ''}`}
                    onClick={() => toggleSection('B2')}
                  >
                    B2 - Intermediate
                    <span className={`chevron ${expandedSections.B2 ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <Link 
                    to="/B2" 
                    className={`nav-level-overview ${isActiveRoute('/B2') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </Link>
                  
                  {expandedSections.B2 && (
                    <div className="nav-topics">
                      <Link 
                        to="/B2/mixedCond" 
                        className={`nav-topic ${isActiveRoute('/B2/mixedCond') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Mixed Conditionals
                      </Link>
                      <Link 
                        to="/B2/causitives" 
                        className={`nav-topic ${isActiveRoute('/B2/causitives') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Causatives
                      </Link>
                      <Link 
                        to="/B2/modalsProb" 
                        className={`nav-topic ${isActiveRoute('/B2/modalsProb') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Modals of Probability
                      </Link>
                      <Link 
                        to="/B2/futurePerf" 
                        className={`nav-topic ${isActiveRoute('/B2/futurePerf') ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        Future Perfect
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Practice Exams Section */}
          <div className="nav-section">
            <button 
              className="nav-section-header"
              onClick={() => toggleSection('exams')}
            >
              📝 Practice Exams
              <span className={`chevron ${expandedSections.exams ? 'expanded' : ''}`}>
                ▼
              </span>
            </button>
            
            {expandedSections.exams && (
              <div className="nav-subsection">
                <Link 
                  to="/exams" 
                  className={`nav-item ${isActiveRoute('/exams') ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  Exam Overview
                </Link>
                <Link 
                  to="/exams/fede" 
                  className={`nav-item ${isActiveRoute('/exams/fede') ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  FEDE Exams
                </Link>
                <Link 
                  to="/exams/toeic" 
                  className={`nav-item ${isActiveRoute('/exams/toeic') ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  TOEIC Exams
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default HamburgerNavigation;