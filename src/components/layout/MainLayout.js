// MainLayout.js - Universal Layout Controller for ALL data packet types
import React from 'react';
import ExercisePanel from '../common/ExercisePanel';
import { parseContent } from '../common/ContentParser';

const MainLayout = (props) => {
  const { 
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
  } = props;

  // Auto-parse data if provided
const parsedContent = React.useMemo(() => {
  if (data) {
    console.log('Parsing data:', data);
    const result = parseContent(data);
    console.log('Parse result:', result);
    return result;
  }
  return { leftContent: null, exerciseData: null };
}, [data]);

// Use parsed content if available, with better fallback logic
const finalLeftContent = parsedContent.leftContent || leftContent;
const finalExerciseData = parsedContent.exerciseData || lessonData;
  console.log('Final content - Left:', !!finalLeftContent, 'Exercise:', !!finalExerciseData); // Simple debug

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
        // Add this just before the return in MainLayout
        console.log('About to render layout with data:', {
          hasLeftContent: !!finalLeftContent,
          hasExerciseData: !!finalExerciseData,
          layoutType
        });
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