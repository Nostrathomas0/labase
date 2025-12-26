// NounsPage.js - SIMPLIFIED VERSION using useLessonPage hook
// FROM ~300 LINES → 75 LINES!

import React from 'react';
import MainLayout from '../../layout/MainLayout';
import PageTurner from '../../common/PageTurner';
import NounsData from '../../../data/grammar/A1/1Nouns.json';
import { useLessonPage } from '../../../hooks/useLessonPage';

const NounsPage = ({ progressManager }) => {
  // ALL logic handled by the hook!
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
    handleLessonComplete
  } = useLessonPage(
    NounsData,           // lesson data
    progressManager,     // from App.js
    'A1',               // level
    'nouns',            // topic
    '/A1/adjectives'    // next lesson URL (auto-advance after completion)
  );

  return (
    <div>
      {/* Progress Display */}
      <div className="progress-display">
        <div className="progress-content">
          <div>
            <h3>Nouns - Page {currentPage + 1} Progress</h3>
            <p>
              Score: {currentProgress.score}% 
              ({currentProgress.correctAnswers}/{currentProgress.totalQuestions} correct)
              {currentProgress.totalQuestions > 0 && (
                <span className={currentProgress.passed ? 'passing' : 'needs-improvement'}>
                  {currentProgress.passed ? ' ✓ PASSING' : ' ✗ NEEDS IMPROVEMENT'}
                </span>
              )}
            </p>
          </div>
        </div>
        
        {saveStatus && (
          <div className={`save-status ${saveStatus.includes('successfully') || saveStatus.includes('saved!') ? 'success' : 'info'}`}>
            {saveStatus}
          </div>
        )}
      </div>

      {/* Main Content */}
      <MainLayout
        layoutType="grammar"
        data={currentPageData}
        progressManager={progressManager}
        onQuestionComplete={handleQuestionComplete}
        onLessonComplete={handleLessonComplete}
      />
      
      {/* Page Navigation */}
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

export default NounsPage;