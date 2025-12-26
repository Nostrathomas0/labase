// useLessonPage.js - Reusable hook for all grammar pages
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook that handles ALL lesson page logic
 * 
 * @param {Object} lessonData - The imported JSON data (e.g., NounsData)
 * @param {Object} progressManager - The progressManager instance from App.js
 * @param {string} level - The level (e.g., 'A1')
 * @param {string} topic - The topic (e.g., 'nouns')
 * @param {string} nextPageUrl - URL to navigate to after completion (e.g., '/A1/adjectives')
 */
export const useLessonPage = (lessonData, progressManager, level, topic, nextPageUrl = null) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const { pages } = lessonData;

  // Start tracking session when page loads or changes
  useEffect(() => {
    if (progressManager) {
      progressManager.startSession(level, topic, currentPage + 1);
    }
  }, [currentPage, level, topic, progressManager]);

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
    console.log('Question completed:', answerData);
  }, []);

  // Called when all questions on page are completed
  const handleLessonComplete = useCallback(async (completionData) => {
    console.log('Lesson completed:', completionData);
    
    setIsLoading(true);
    setSaveStatus('Completing page...');
    
    try {
      const result = await progressManager.completePage();
      
      if (result.jwtUpdated) {
        const passed = result.passed;
        const score = result.score;
        
        setSaveStatus(`Page completed! Score: ${score}% (${passed ? 'PASSED' : 'FAILED'})`);
        
        // AUTO-ADVANCE LOGIC
        if (score >= 60) {
          // Check if there's another page in this lesson
          if (currentPage < pages.length - 1) {
            // Move to next page in same lesson
            setTimeout(() => {
              setSaveStatus('Great job! Moving to next page...');
              setCurrentPage(prev => prev + 1);
            }, 2000);
          } else if (nextPageUrl) {
            // Move to next lesson
            setTimeout(() => {
              setSaveStatus('Lesson complete! Moving to next lesson...');
              navigate(nextPageUrl);
            }, 2000);
          } else {
            // Last page of last lesson
            setTimeout(() => {
              setSaveStatus('Congratulations! Lesson complete!');
            }, 2000);
          }
        } else {
          // Score < 60% - stay on page
          setSaveStatus(`Score below 60%. Review and try again!`);
        }
      } else {
        setSaveStatus('Page completed but save failed');
      }
    } catch (error) {
      console.error('Error completing page:', error);
      setSaveStatus('Error completing page');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  }, [progressManager, currentPage, pages.length, nextPageUrl, navigate]);

  // Get current page data in format expected by ContentParser
  const currentPageData = {
    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Page ${currentPage + 1}`,
    content: pages[currentPage]?.questions || []
  };

  // Get current progress for display
  const currentProgress = progressManager ? progressManager.getPageProgress() : {
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    passed: false
  };

  return {
    // State
    currentPage,
    currentPageData,
    currentProgress,
    isLoading,
    saveStatus,
    totalPages: pages.length,
    
    // Handlers
    nextPage,
    previousPage,
    handleQuestionComplete,
    handleLessonComplete
  };
};

export default useLessonPage;
