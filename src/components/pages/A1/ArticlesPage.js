// src/components/pages/A1/ArticlesPage.js
import React from 'react';
import PremiumLessonLayout from '../../premium/PremiumLessonLayout';
import ArticlesData from '../../../data/grammar/A1/6Articles.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const ArticlesPage = ({ progressManager }) => {
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
    ArticlesData,
    progressManager,
    'A1',
    'articles',
    '/A1/verbs'
  );

  return (
    <div>
      {saveStatus && (
        <div className="save-status">{saveStatus}</div>
      )}
      <PremiumLessonLayout
        lessonData={ArticlesData}
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

export default ArticlesPage;