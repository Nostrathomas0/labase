// src/components/pages/A1/PossessivesPage.js
import React from 'react';
import PremiumLessonLayout from '../../premium/PremiumLessonLayout';
import HelpVerbsData from '../../../data/grammar/A2/6HelpingVerbs.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const HelpVerbsPage = ({ progressManager }) => {
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
    HelpVerbsData,
    progressManager,
    'A2',
    'helping-verbs',
    '/A2/articles'
  );

  return (
    <div>
      {saveStatus && (
        <div className="save-status">{saveStatus}</div>
      )}
      <PremiumLessonLayout
        lessonData={HelpVerbsData}
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

export default HelpVerbsPage;