// src/components/pages/A1/PossessivesPage.js
import React from 'react';
import PremiumLessonLayout from '../../premium/PremiumLessonLayout';
import RelClauseData from '../../../data/grammar/A2/5RelativeClauses.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const RelClausesPage = ({ progressManager }) => {
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
    RelClauseData,
    progressManager,
    'A2',
    'relative-clauses',
    '/A2/articles'
  );

  return (
    <div>
      {saveStatus && (
        <div className="save-status">{saveStatus}</div>
      )}
      <PremiumLessonLayout
        lessonData={RelClauseData}
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

export default RelClausesPage;