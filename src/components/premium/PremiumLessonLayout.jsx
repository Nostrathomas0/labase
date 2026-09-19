// src/components/premium/PremiumLessonLayout.jsx
import React from 'react';
import LessonTimeline from './LessonTimeline';
import ExercisePanel from '../common/ExercisePanel';

const PremiumLessonLayout = ({
  lessonData,
  currentPage,
  currentPageData,
  completedPages,
  onPageChange,
  progressManager,
  onQuestionComplete,
  onLessonComplete,
}) => {

  // ExercisePanel expects { questions, lessonId }
  // useLessonPage returns { title, content }
  const exerciseData = currentPageData ? {
    questions: currentPageData.content || [],
    lessonId: `${lessonData.topic}-page-${currentPage}`,
  } : null;

  return (
    <div className="premium-lesson-layout">

      <LessonTimeline
        lessonData={lessonData}
        currentPage={currentPage}
        onPageChange={onPageChange}
        completedPages={completedPages}
      />

      <div className="premium-lesson-content">
        {exerciseData && exerciseData.questions.length > 0 ? (
          <ExercisePanel
            lessonData={exerciseData}
            progressManager={progressManager}
            onQuestionComplete={onQuestionComplete}
            onLessonComplete={onLessonComplete}
          />
        ) : (
          <div className="no-exercises">
            <p>Loading...</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PremiumLessonLayout;