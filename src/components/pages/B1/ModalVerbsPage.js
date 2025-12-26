//ModalVerbsPage.js - Updated to use MainLayout and ContentParser
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import ModalVerbsData from '../../../data/grammar/B1/4ModalVerbs.json';
import PageTurner from '../../common/PageTurner';
import { useLessonPage } from '../../../hooks/useLessonPage';

const ModalVerbsPage = ({ progressManager }) => {
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
    ModalVerbsData,
      progressManager,
      'B1',
      'modal_verbs',
      'B2/FuturePerf'
  );
  return (
    <div>
      <div className="progress-display">
        <div className="progress-content">
          <div>
            <h3>Modal Verbs - Page {currentPage + 1} Progress</h3>  {/* ← CHANGE THIS */}
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
        {saveStatus && <div className="save-status">{saveStatus}</div>}
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

export default ModalVerbsPage;  // ← CHANGE THIS