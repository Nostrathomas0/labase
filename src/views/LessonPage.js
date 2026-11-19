// src/views/LessonPage.js
// One component for every grammar lesson. Route: /:level/:slug
// Replaces the 24 per-lesson files that used to live in components/pages/.

import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PageTurner from '../components/common/PageTurner';
import PremiumRoute from '../components/premium/PremiumRoute';
import PremiumLessonLayout from '../components/premium/PremiumLessonLayout';
import { useLessonPage } from '../hooks/useLessonPage';
import { useContent } from '../hooks/useContent';
import { findLesson, getNextLesson, lessonPath } from '../catalogue/catalogue';

// ── Standard layout: split panels + page turner ──────────────────
const StandardLesson = ({ lesson, lessonData, progressManager, nextUrl }) => {
  const {
    currentPage, currentPageData, currentProgress, isLoading, saveStatus,
    totalPages, nextPage, previousPage, handleQuestionComplete, handleLessonComplete,
  } = useLessonPage(lessonData, progressManager, lesson.progress.level, lesson.progress.topic, nextUrl, lesson.title);

  const saved = saveStatus.includes('successfully') || saveStatus.includes('saved!');

  return (
    <div>
      <div className="progress-display">
        <div className="progress-content">
          <div>
            <h3>{lesson.title} - Page {currentPage + 1} Progress</h3>
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
          <div className={`save-status ${saved ? 'success' : 'info'}`}>{saveStatus}</div>
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

// ── Timeline layout (premium) ────────────────────────────────────
const TimelineLesson = ({ lesson, lessonData, progressManager, nextUrl }) => {
  const {
    currentPage, currentPageData, completedPages, isLoading, saveStatus,
    goToPage, handleQuestionComplete, handleLessonComplete,
  } = useLessonPage(lessonData, progressManager, lesson.progress.level, lesson.progress.topic, nextUrl, lesson.title);

  return (
    <div>
      {saveStatus && <div className="save-status">{saveStatus}</div>}
      <PremiumLessonLayout
        lessonData={lessonData}
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

// ── Loads the JSON, then renders the right layout ────────────────
// Exported so other routes (e.g. /session/:id) can render any lesson entry.
// nextUrl: undefined = work it out from the catalogue; null = no next lesson.
export const LessonLoader = ({ lesson, progressManager, nextUrl }) => {
  const { data, error, loading } = useContent(lesson);
  if (loading) return <div className="access-loading">Loading...</div>;
  if (error || !data || !Array.isArray(data.pages)) {
    return <div className="no-exercises"><p>This lesson couldn't be loaded. Please try again.</p></div>;
  }

  let next = nextUrl;
  if (next === undefined) {
    const nextLesson = getNextLesson(lesson);
    next = nextLesson ? lessonPath(nextLesson) : null;
  }
  const props = { lesson, lessonData: data, progressManager, nextUrl: next };

  if (lesson.layout === 'timeline') return <TimelineLesson {...props} />;
  return (
    <MainLayout layoutType="grammar">
      <StandardLesson {...props} />
    </MainLayout>
  );
};

const LessonPage = ({ progressManager }) => {
  const { level, slug } = useParams();
  const lesson = findLesson(level, slug);

  if (!lesson) return <Navigate to="/" replace />;

  // Old or mistyped URLs (aliases, wrong case) redirect to the canonical one
  if (`/${level}/${slug}` !== lessonPath(lesson)) {
    return <Navigate to={lessonPath(lesson)} replace />;
  }

  // key resets page state when moving from one lesson to the next
  const content = <LessonLoader key={lesson.id} lesson={lesson} progressManager={progressManager} />;

  // Premium check happens before the lesson is downloaded
  return lesson.premium ? <PremiumRoute>{content}</PremiumRoute> : content;
};

export default LessonPage;
