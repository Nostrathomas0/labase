// src/components/pages/A1/PossessivesPage.js
import React from 'react';
import PremiumLessonLayout from '../../premium/PremiumLessonLayout';
import PossessivesData from '../../../data/grammar/A1/5Possessives.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const PossessivesPage = ({ progressManager }) => {
  const {
    currentPage,
    currentPageData,
    completedPages,
    isLoading,
    saveStatus,
    goToPage,
    handleQuestionComplete,
    handleLessonComplete,
  } = useLessonPage(
    PossessivesData,
    progressManager,
    'A1',
    'possessives',
    '/A1/articles'
  );

  return (
    <div>
      {saveStatus && (
        <div className="save-status">{saveStatus}</div>
      )}
      <PremiumLessonLayout
        lessonData={PossessivesData}
        currentPage={currentPage}
        currentPageData={currentPageData}
        completedPages={completedPages}
        onPageChange={goToPage}
        progressManager={progressManager}
        onQuestionComplete={handleQuestionComplete}
        onLessonComplete={handleLessonComplete}
        disabled={isLoading}
      />
    </div>
  );
};

export default PossessivesPage;