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
  const hasDataForSplit = finalLeftContent || finalExerciseData;
  
  console.log('Final content - Left:', !!finalLeftContent, 'Exercise:', !!finalExerciseData);

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
        // Only create split layout if we have data for it
        if (hasDataForSplit) {
          return (
            <div className="layout-split grammar-layout">
              <div className="split-left grammar-content">
                {finalLeftContent}
              </div>
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
        }
        // Fall back to full-width for children to handle their own layout
        return (
          <div className="layout-full-width">
            {children}
          </div>
        );

      case 'exam':
        // Only create split layout if we have data for it
        if (hasDataForSplit) {
          return (
            <div className="layout-split exam-layout">
              <div className="split-left exam-text">
                {finalLeftContent}
              </div>
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
        }
        // Fall back to full-width for children to handle their own layout
        return (
          <div className="layout-full-width">
            {children}
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