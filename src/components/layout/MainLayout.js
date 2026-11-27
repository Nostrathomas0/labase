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
    onLessonComplete = null,
    // Optional page controls shown in the mobile handle bar:
    // { current (1-based), total, onPrev, onNext, disabled }
    pageNav = null
  } = props;

  // Mobile only: which panel gets the large share of the screen.
  // 'lesson' = lesson 75% / exercise 20% (default); 'exercise' = the reverse.
  const [focus, setFocus] = React.useState('lesson');
  const toggleFocus = () => setFocus((f) => (f === 'lesson' ? 'exercise' : 'lesson'));

  // On phones, the first tap on the collapsed exercise strip only expands it,
  // so a student can't pick an answer by accident while it's small.
  const handleExerciseTapCapture = (e) => {
    const isPhone = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const panel = e.currentTarget;
    const split = panel.parentElement;
    // Only when the strip is actually small (short lessons already give it most of the screen)
    const isCollapsed = split && panel.getBoundingClientRect().height < split.getBoundingClientRect().height * 0.35;
    if (isPhone && focus === 'lesson' && isCollapsed) {
      e.preventDefault();
      e.stopPropagation();
      setFocus('exercise');
    }
  };

  // A new page starts with the lesson in view
  const sectionKey = lessonData && lessonData.lessonId;
  React.useEffect(() => { setFocus('lesson'); }, [data, sectionKey]);

  // Auto-parse data if provided
  const parsedContent = React.useMemo(() => {
    if (data) {
      const result = parseContent(data);
      return result;
    }
    return { leftContent: null, exerciseData: null };
  }, [data]);

  // Use parsed content if available, with better fallback logic
  const finalLeftContent = parsedContent.leftContent || leftContent;
  const finalExerciseData = parsedContent.exerciseData || lessonData;
  const hasDataForSplit = finalLeftContent || finalExerciseData;
  


  // Mobile handle bar between the stacked panels (hidden on desktop by CSS):
  // optional previous/next page buttons + a toggle that swaps the panel sizes.
  const renderHandle = () => (
    <div className="split-handle">
      {pageNav && (
        <button
          type="button"
          className="split-handle-page"
          onClick={pageNav.onPrev}
          disabled={pageNav.disabled || pageNav.current <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>
      )}
      <button
        type="button"
        className="split-handle-toggle"
        onClick={toggleFocus}
        aria-expanded={focus === 'exercise'}
        aria-label={focus === 'lesson' ? 'Expand exercises' : 'Expand lesson'}
      >
        <span className="split-handle-grip" aria-hidden="true" />
        <span className="split-handle-label">
          {pageNav ? `Page ${pageNav.current} / ${pageNav.total}` : (focus === 'lesson' ? 'Questions' : 'Text')}
          <span className="split-handle-arrow" aria-hidden="true">
            {focus === 'lesson' ? ' ▲' : ' ▼'}
          </span>
        </span>
      </button>
      {pageNav && (
        <button
          type="button"
          className="split-handle-page"
          onClick={pageNav.onNext}
          disabled={pageNav.disabled || pageNav.current >= pageNav.total}
          aria-label="Next page"
        >
          ›
        </button>
      )}
    </div>
  );

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
            <div className="layout-split grammar-layout" data-focus={focus}>
              <div className="split-left grammar-content">
                {finalLeftContent}
              </div>

              {renderHandle()}

              <div className="split-right grammar-exercises" onClickCapture={handleExerciseTapCapture}>
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
            <div className="layout-split exam-layout" data-focus={focus}>
              <div className="split-left exam-text">
                {finalLeftContent}
              </div>

              {renderHandle()}

              <div className="split-right exam-questions" onClickCapture={handleExerciseTapCapture}>
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