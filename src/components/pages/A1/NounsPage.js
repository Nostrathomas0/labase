//NounsPage.js - Updated to use MainLayout and ContentParser
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layout/MainLayout';
import NounsData from '../../../data/grammar/A1/1Nouns.json';
import PageTurner from '../../common/PageTurner';


const NounsPage = ({ progressManager }) => {
  console.log('NEW NOUNS PAGE LOADED - MainLayout version');
  
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const { pages } = NounsData;

  useEffect(() => {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Current Questions:`, pages[currentPage]?.questions);
    
    // Start progress tracking session for current page
    progressManager.startSession('A1', 'nouns', currentPage + 1);
  }, [currentPage, pages, progressManager]);


  // Save progress before navigating to next page
  const nextPage = useCallback(async () => {
    if (currentPage < pages.length - 1) {
      setIsLoading(true);
      setSaveStatus('Saving progress...');
      
      try {
        const saved = await progressManager.saveCurrentProgress();
        
        if (saved) {
          setSaveStatus('Progress saved!');
          setCurrentPage(prevPage => prevPage + 1);
        } else {
          setSaveStatus('Save failed - continuing anyway');
          setCurrentPage(prevPage => prevPage + 1);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
        setSaveStatus('Save error - continuing anyway');
        setCurrentPage(prevPage => prevPage + 1);
      } finally {
        setIsLoading(false);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  }, [currentPage, pages.length, progressManager]);

  // Save progress before navigating to previous page
  const previousPage = useCallback(async () => {
    if (currentPage > 0) {
      setIsLoading(true);
      setSaveStatus('Saving progress...');
      
      try {
        const saved = await progressManager.saveCurrentProgress();
        
        if (saved) {
          setSaveStatus('Progress saved!');
          setCurrentPage(prevPage => prevPage - 1);
        } else {
          setSaveStatus('Save failed - continuing anyway');
          setCurrentPage(prevPage => prevPage - 1);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
        setSaveStatus('Save error - continuing anyway');
        setCurrentPage(prevPage => prevPage - 1);
      } finally {
        setIsLoading(false);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  }, [currentPage, progressManager]);

  const handleQuestionComplete = (answerData) => {
    console.log('Question completed:', answerData);
    // This gets called when individual questions are answered
  };

  const handleLessonComplete = useCallback(async (completionData) => {
  console.log('Lesson completed:', completionData);
  
  setIsLoading(true);
  setSaveStatus('Auto-completing page...');
  
  try {
    const result = await progressManager.completePage();
    
    if (result.jwtUpdated) {
      setSaveStatus(`Page completed! Score: ${result.score}% (${result.passed ? 'PASSED' : 'FAILED'})`);
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
}, [progressManager]);

  // Convert the current page questions to the format expected by ContentParser
  const currentPageData = {
    title: `Nouns - Page ${currentPage + 1}`,
    content: pages[currentPage]?.questions || []
  };

  console.log('About to render, currentPageData:', currentPageData);

  const currentProgress = progressManager.getPageProgress();
  
  return (
    <div>
      {/* Progress Display - This will go above the layout */}
      <div className="progress-display" style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Nouns - Page {currentPage + 1} Progress</h3>
            <p>
              Score: {currentProgress.score}% 
              ({currentProgress.correctAnswers}/{currentProgress.totalQuestions} correct)
              {currentProgress.totalQuestions > 0 && (
                <span style={{ 
                  marginLeft: '10px',
                  color: currentProgress.passed ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {currentProgress.passed ? 'PASSING' : 'NEEDS IMPROVEMENT'}
                </span>
              )}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Use navigation menu for Save/Complete
            </span>
          </div>
        </div>
        
        {saveStatus && (
          <div style={{ 
            marginTop: '10px', 
            padding: '8px', 
            backgroundColor: saveStatus.includes('successfully') || saveStatus.includes('saved!') ? '#d4edda' : '#f8d7da',
            color: saveStatus.includes('successfully') || saveStatus.includes('saved!') ? '#155724' : '#721c24',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {saveStatus}
          </div>
        )}
      </div>

      {/* Main Layout with parsed content */}
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
        totalPages={pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        disabled={isLoading}
      />
    </div>
  );
};

export default NounsPage;