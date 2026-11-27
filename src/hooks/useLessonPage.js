// useLessonPage.js - Reusable hook for all grammar pages
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLessonPage = (lessonData, progressManager, level, topic, nextPageUrl = null, displayTitle = null) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [completedPages, setCompletedPages] = useState([]);

  const { pages } = lessonData;

  // Start tracking session when page loads or changes
  useEffect(() => {
    if (progressManager) {
      progressManager.startSession(level, topic, currentPage + 1);
    }
  }, [currentPage, level, topic, progressManager]);

  // ── goToPage — direct jump for LessonTimeline ─────────────────
  // Checks page title unlock requirement if present in JSON
  // JSON shape: { "title": "...", "unlockRequires": 60, "questions": [...] }
  const goToPage = useCallback((index) => {
    if (index < 0 || index >= pages.length) return;

    // Allow free backward navigation
    if (index < currentPage) {
      setCurrentPage(index);
      return;
    }

    // Forward: check if previous page was completed at required score
    const targetPage = pages[index];
    const requiredScore = targetPage?.unlockRequires ?? 0;

    if (requiredScore > 0 && !completedPages.includes(index - 1)) {
      setSaveStatus(`Complete page ${index} first to unlock this.`);
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setCurrentPage(index);
  }, [pages, currentPage, completedPages]);

  // Navigate to next page with auto-save
  const nextPage = useCallback(async () => {
    if (currentPage < pages.length - 1) {
      setIsLoading(true);
      setSaveStatus('Saving progress...');
      try {
        await progressManager.saveCurrentProgress();
        setSaveStatus('Progress saved!');
        setCurrentPage(prev => prev + 1);
      } catch (error) {
        console.error('Error saving progress:', error);
        setSaveStatus('Save error - continuing anyway');
        setCurrentPage(prev => prev + 1);
      } finally {
        setIsLoading(false);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  }, [currentPage, pages.length, progressManager]);

  // Navigate to previous page with auto-save
  const previousPage = useCallback(async () => {
    if (currentPage > 0) {
      setIsLoading(true);
      setSaveStatus('Saving progress...');
      try {
        await progressManager.saveCurrentProgress();
        setSaveStatus('Progress saved!');
        setCurrentPage(prev => prev - 1);
      } catch (error) {
        console.error('Error saving progress:', error);
        setSaveStatus('Save error - continuing anyway');
        setCurrentPage(prev => prev - 1);
      } finally {
        setIsLoading(false);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  }, [currentPage, progressManager]);

  // Called when individual questions are answered
  const handleQuestionComplete = useCallback((answerData) => {
  }, []);

  // Called when all questions on page are completed
  const handleLessonComplete = useCallback(async (completionData) => {

    setIsLoading(true);
    setSaveStatus('Completing page...');

    try {
      const result = await progressManager.completePage();

      if (result.saved) {
        const passed = result.passed;
        const score = result.score;

        setSaveStatus(`Page completed! Score: ${score}% (${passed ? 'PASSED' : 'FAILED'})`);

        // Mark page as completed for timeline
        if (!completedPages.includes(currentPage)) {
          setCompletedPages(prev => [...prev, currentPage]);
        }

        if (score >= 60) {
          if (currentPage < pages.length - 1) {
            setTimeout(() => {
              setSaveStatus('Great job! Moving to next page...');
              setCurrentPage(prev => prev + 1);
            }, 2000);
          } else if (nextPageUrl) {
            setTimeout(() => {
              setSaveStatus('Lesson complete! Moving to next lesson...');
              navigate(nextPageUrl);
            }, 2000);
          } else {
            setTimeout(() => {
              setSaveStatus('Congratulations! Lesson complete!');
            }, 2000);
          }
        } else {
          setSaveStatus(`Score below 60%. Review and try again!`);
        }
      } else {
        // Not signed in — still mark page complete locally
        if (!completedPages.includes(currentPage)) {
          setCompletedPages(prev => [...prev, currentPage]);
        }
        setSaveStatus('Page completed');
        if (currentPage < pages.length - 1) {
          setTimeout(() => setCurrentPage(prev => prev + 1), 2000);
        }
      }
    } catch (error) {
      console.error('Error completing page:', error);
      setSaveStatus('Error completing page');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  }, [progressManager, currentPage, pages.length, nextPageUrl, navigate, completedPages]);

  // Current page data for ContentParser
  const currentPageData = {
    title: `${displayTitle || topic.charAt(0).toUpperCase() + topic.slice(1)} - Page ${currentPage + 1}`,
    content: pages[currentPage]?.questions || []
  };

  // Current progress for display
  const currentProgress = progressManager ? progressManager.getPageProgress() : {
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    passed: false
  };

  return {
    currentPage,
    currentPageData,
    currentProgress,
    isLoading,
    saveStatus,
    totalPages: pages.length,
    completedPages,      // ← consumed by LessonTimeline
    goToPage,            // ← consumed by LessonTimeline onPageChange
    nextPage,
    previousPage,
    handleQuestionComplete,
    handleLessonComplete,
  };
};

export default useLessonPage;