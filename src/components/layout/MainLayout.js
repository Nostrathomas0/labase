// MainLayout.js - Universal Layout Controller for ALL data packet types
import React from 'react';
import ExercisePanel from './common/ExercisePanel';
import { parseContent } from './ContentParser';

const MainLayout = ({ 
  layoutType, 
  leftContent = null, 
  rightContent = null, 
  children,
  // Raw data - will be auto-parsed
  data = null,
  // For exercise functionality
  lessonData = null,
  progressManager = null,
  onQuestionComplete = null,
  onLessonComplete = null
}) => {

  // Auto-parse data if provided
  const parsedContent = React.useMemo(() => {
    if (data && !leftContent && !rightContent && !lessonData) {
      return parseContent(data);
    }
    return { leftContent, exerciseData: lessonData };
  }, [data, leftContent, rightContent, lessonData]);

  // Use parsed content if available
  const finalLeftContent = parsedContent.leftContent || leftContent;
  const finalExerciseData = parsedContent.exerciseData || lessonData;

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
                {finalLeftContent || children}
              </div>
            </div>
            <div className="split-right grammar-exercises">
              <div className="exercises-container">
                {rightContent ? (
                  rightContent
                ) : finalExerciseData ? (
                  <ExercisePanel
                    lessonData={finalExerciseData}
                    progressManager={progressManager}
                    onQuestionComplete={onQuestionComplete}
                    onLessonComplete={onLessonComplete}
                  />
                ) : (
                  <div className="exercises-placeholder">
                    <h3>Interactive Exercises</h3>
                    <p>Complete the exercises to practice this grammar topic.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'exam':
        return (
          <div className="layout-split exam-layout">
            <div className="split-left exam-text">
              <div className="exam-reading-content">
                {finalLeftContent || children}
              </div>
            </div>
            <div className="split-right exam-questions">
              <div className="questions-container">
                {rightContent ? (
                  rightContent
                ) : finalExerciseData ? (
                  <ExercisePanel
                    lessonData={finalExerciseData}
                    progressManager={progressManager}
                    onQuestionComplete={onQuestionComplete}
                    onLessonComplete={onLessonComplete}
                  />
                ) : (
                  <div className="questions-placeholder">
                    <h3>Questions & Navigation</h3>
                    <p>Answer the questions based on the text passages.</p>
                  </div>
                )}
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