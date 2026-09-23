// src/components/pages/A1/PossessivesPage.js
import React from 'react';
import PremiumLessonLayout from '../../premium/PremiumLessonLayout';
import HalfModalsData from '../../../data/grammar/B1/5HalfModals.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const HalfModalsPage = ({ progressManager }) => {
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
    HalfModalsData,
    progressManager,
    'A1',
    'half-modals',
    '/A1/articles'
  );

  return (
    <div>
      {saveStatus && (
        <div className="save-status">{saveStatus}</div>
      )}
      <PremiumLessonLayout
        lessonData={HalfModalsData}
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

export default HalfModalsPage;