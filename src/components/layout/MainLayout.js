// MainLayout.js - Universal Layout Controller for ALL data packet types
import React from 'react';
import ExercisePanel from '../common/ExercisePanel.js';
import { parseContent } from '../common/ContentParser.js';

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
            {/* LEFT SECTION - Images and Instructions */}
            <div className="split-left grammar-content">
              {finalLeftContent || children}
            </div>
            
            {/* RIGHT SECTION - Interactive Exercises */}
            <div className="split-right grammar-exercises">
              {finalExerciseData && progressManager ? (
                <ExercisePanel
                  lessonData={finalExerciseData}
                  progressManager={progressManager}
                  onQuestionComplete={onQuestionComplete}
                  onLessonComplete={onLessonComplete}
                />
              ) : rightContent ? (
                rightContent
              ) : (
                <div className="no-exercises">
                  <p>No exercises available</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'exam':
        return (
          <div className="layout-split exam-layout">
            {/* LEFT SECTION - Reading Content */}
            <div className="split-left exam-text">
              {finalLeftContent || children}
            </div>
            
            {/* RIGHT SECTION - Questions */}
            <div className="split-right exam-questions">
              {finalExerciseData && progressManager ? (
                <ExercisePanel
                  lessonData={finalExerciseData}
                  progressManager={progressManager}
                  onQuestionComplete={onQuestionComplete}
                  onLessonComplete={onLessonComplete}
                />
              ) : rightContent ? (
                rightContent
              ) : (
                <div className="no-questions">
                  <p>No questions available</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
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