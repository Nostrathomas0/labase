// MainLayout.js - Smart Layout Controller
import React from 'react';

const MainLayout = ({ layoutType, children }) => {
  // Different layout types:
  // 'navigation' = Full width (for level selection, exam home)
  // 'grammar' = Split layout (images/instructions left, exercises right)  
  // 'exam' = Split layout (reading text left, questions right)

  const renderLayout = () => {
    switch (layoutType) {
      case 'navigation':
        return (
          <div className="layout-full-width">
            <div className="content-container">
              {children}
            </div>
          </div>
        );

      case 'grammar':
        return (
          <div className="layout-split grammar-layout">
            <div className="split-left grammar-content">
              <div className="grammar-images-instructions">
                {/* This will be populated by the grammar page components */}
                {children}
              </div>
            </div>
            <div className="split-right grammar-exercises">
              <div className="exercises-container">
                {/* Exercise components will render here */}
                <div className="exercises-placeholder">
                  <h3>Interactive Exercises</h3>
                  <p>Complete the exercises to practice this grammar topic.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exam':
        return (
          <div className="layout-split exam-layout">
            <div className="split-left exam-text">
              <div className="exam-reading-content">
                {/* Exam text passages will render here */}
                {children}
              </div>
            </div>
            <div className="split-right exam-questions">
              <div className="questions-container">
                {/* Questions and navigation will render here */}
                <div className="questions-placeholder">
                  <h3>Questions & Navigation</h3>
                  <p>Answer the questions based on the text passages.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="layout-default">
            <div className="content-container">
              {children}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`main-layout layout-type-${layoutType}`}>
      {renderLayout()}
    </div>
  );
};

export default MainLayout;