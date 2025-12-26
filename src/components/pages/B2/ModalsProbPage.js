//ModalsProbPage.js - Updated to use MainLayout and ContentParser
import React from 'react';
import MainLayout from '../../layout/MainLayout';
import ModalsProbData from '../../../data/grammar/B2/3ModalsProbability.json';
import PageTurner from '../../common/PageTurner';
import { useLessonPage } from '../../../hooks/useLessonPage';

const ModalsProbPage = ({ progressManager }) => {
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
    ModalsProbData,
    progressManager,
    'B2',
    'ModalsProb',
    'B2/Causitives'
  );

  return (
    <div>
      <div className="progress-display">
        <div className="progress-content">
          <div>
            <h3> Modals of Probability - Page {currentPage + 1} Progress</h3>  {/* ← CHANGE THIS */}
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

export default ModalsProbPage;  // ← CHANGE THIS