// HamburgerNavigation.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const HamburgerNavigation = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const location = useLocation();

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleLinkClick = () => {
    // Close sidebar when a link is clicked (especially useful on mobile)
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
            {/* Progress Controls */}
          <div className="nav-section progress-controls">
            <div className="nav-section-header">💾 Progress</div>
            <div className="nav-subsection">
              <button 
                className="nav-item progress-btn save-btn"
                onClick={() => window.saveProgress && window.saveProgress()}
              >
                💾 Save Progress
              </button>
              <button 
                className="nav-item progress-btn complete-btn"
                onClick={() => window.completePage && window.completePage()}
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