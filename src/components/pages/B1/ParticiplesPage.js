// src/components/pages/A1/PossessivesPage.js
import React from 'react';
import PremiumLessonLayout from '../../premium/PremiumLessonLayout';
import ParticiplesData from '../../../data/grammar/B1/6Participles.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const ParticiplesPage = ({ progressManager }) => {
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
    ParticiplesData,
    progressManager,
    'B1',
    'participles',
    '/B1/articles'
  );

  return (
    <div>
      {saveStatus && (
        <div className="save-status">{saveStatus}</div>
      )}
      <PremiumLessonLayout
        lessonData={ParticiplesData}
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

export default ParticiplesPage;