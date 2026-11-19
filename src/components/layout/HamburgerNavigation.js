// HamburgerNavigation.js - Updated with Score Display
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LEVELS, EXAMS, getLessonsByLevel, lessonPath } from '../../catalogue/catalogue';
import { SESSIONS } from '../../data/sessions';

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

 
          {progressManager && overallStats && (
            <div className="nav-section score-display">
              <div className="nav-section-header">📊 Your Progress</div>
              
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
            </div>
          )}
          {/* END OF ADDED SECTION */}

          {/* Progress Controls */}
          <div className="nav-section progress-controls"></div>
    

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

          {/* Grammar Lessons Section — generated from the catalogue */}
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
                {LEVELS.map((level) => (
                  <div className="nav-level" key={level.id}>
                    <button
                      className={`nav-level-header ${isActiveLevelSection(level.id) ? 'active' : ''}`}
                      onClick={() => toggleSection(level.id)}
                    >
                      {level.label}
                      <span className={`chevron ${expandedSections[level.id] ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </button>
                    <Link
                      to={`/${level.id}`}
                      className={`nav-level-overview ${isActiveRoute(`/${level.id}`) ? 'active' : ''}`}
                      onClick={handleLinkClick}
                    >
                      Overview
                    </Link>

                    {expandedSections[level.id] && (
                      <div className="nav-topics">
                        {getLessonsByLevel(level.id).map((lesson) => (
                          <Link
                            key={lesson.id}
                            to={lessonPath(lesson)}
                            className={`nav-topic ${isActiveRoute(lessonPath(lesson)) ? 'active' : ''}`}
                            onClick={handleLinkClick}
                          >
                            {lesson.title}{lesson.premium ? ' ⭐' : ''}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Class Sessions — from content/sessions (temporary until "My classes" reads Firestore) */}
          {Object.keys(SESSIONS).length > 0 && (
            <div className="nav-section">
              <button
                className="nav-section-header"
                onClick={() => toggleSection('sessions')}
              >
                🎓 Class Sessions
                <span className={`chevron ${expandedSections.sessions ? 'expanded' : ''}`}>
                  ▼
                </span>
              </button>

              {expandedSections.sessions && (
                <div className="nav-subsection">
                  {Object.values(SESSIONS).map((session) => (
                    <Link
                      key={session.id}
                      to={`/session/${session.id}`}
                      className={`nav-item ${isActiveRoute(`/session/${session.id}`) ? 'active' : ''}`}
                      onClick={handleLinkClick}
                    >
                      {session.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Practice Exams Section — generated from the catalogue */}
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
                {EXAMS.map((exam) => (
                  <Link
                    key={exam.id}
                    to={`/exams/${exam.id}`}
                    className={`nav-item ${isActiveRoute(`/exams/${exam.id}`) ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    {exam.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default HamburgerNavigation;