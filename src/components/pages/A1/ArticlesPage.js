// src/components/pages/A1/ArticlesPage.js
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import PageTurner from '../../common/PageTurner';
import ArticlesData from '../../../data/grammar/A1/6Articles.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const ArticlesPage = ({ progressManager }) => {
  const {
    currentPage,
    currentPageData,
    currentProgress,
    isLoading,
    saveStatus,
    totalPages,
    nextPage,
    previousPage,
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
      <div className="progress-display">
        <div className="progress-content">
          <h3>Articles — Page {currentPage + 1} of {totalPages}</h3>
          <p>
            Score: {currentProgress.score}%
            ({currentProgress.correctAnswers}/{currentProgress.totalQuestions} correct)
          </p>
        </div>
        {saveStatus && (
          <div className="save-status">{saveStatus}</div>
        )}
      </div>

      <MainLayout
        layoutType="grammar"
        data={currentPageData}
        progressManager={progressManager}
        onQuestionComplete={handleQuestionComplete}
        onLessonComplete={handleLessonComplete}
      />

      <PageTurner
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
        disabled={isLoading}
      />
    </div>
  );
};

export default ArticlesPage;