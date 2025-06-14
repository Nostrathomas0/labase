// UniversalPage.js - Universal component that works with ANY data packet
import React, { useState, useEffect } from 'react';
import MainLayout from './MainLayout';
import { parseContent } from './ContentParser';
import { useAuth } from '../AuthContext';

const UniversalPage = ({ 
  dataSource, // URL, file path, or direct data object
  layoutType = 'grammar', // 'grammar', 'exam', or 'navigation'
  pageTitle = null 
}) => {
  const { progressManager } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let loadedData;

        if (typeof dataSource === 'string') {
          // Load from URL or file path
          const response = await fetch(dataSource);
          if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`);
          }
          loadedData = await response.json();
        } else if (typeof dataSource === 'object') {
          // Direct data object
          loadedData = dataSource;
        } else {
          throw new Error('Invalid data source');
        }

        setData(loadedData);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (dataSource) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [dataSource]);

  const handleQuestionComplete = (answerData) => {
    console.log('Question completed:', answerData);
    
    // Auto-save progress if progressManager is available
    if (progressManager) {
      progressManager.updateProgress(answerData);
    }
    
    // Custom handling can be added here
  };

  const handleLessonComplete = (completionData) => {
    console.log('Lesson completed:', completionData);
    
    // Mark lesson as complete
    if (progressManager) {
      progressManager.completeLesson(completionData);
    }
    
    // Could trigger navigation to next lesson, show completion modal, etc.
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout layoutType={layoutType}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading content...</p>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout layoutType={layoutType}>
        <div className="error-container">
          <h3>Error Loading Content</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </MainLayout>
    );
  }

  // No data
  if (!data) {
    return (
      <MainLayout layoutType={layoutType}>
        <div className="no-data-container">
          <h3>No Content Available</h3>
          <p>No data was provided for this page.</p>
        </div>
      </MainLayout>
    );
  }

  // Parse the content
  const { leftContent, exerciseData } = parseContent(data);

  // Handle different layout types
  if (layoutType === 'navigation') {
    // Full-width layout for navigation pages
    return (
      <MainLayout layoutType="navigation">
        <div className="navigation-content">
          {pageTitle && <h1>{pageTitle}</h1>}
          {leftContent || (
            <div dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }} />
          )}
        </div>
      </MainLayout>
    );
  }

  // Split layout for grammar/exam pages
  return (
    <MainLayout
      layoutType={layoutType}
      leftContent={leftContent}
      lessonData={exerciseData}
      progressManager={progressManager}
      onQuestionComplete={handleQuestionComplete}
      onLessonComplete={handleLessonComplete}
    />
  );
};

// Convenience wrapper components for specific use cases
export const GrammarPage = ({ dataSource, pageTitle }) => (
  <UniversalPage 
    dataSource={dataSource} 
    layoutType="grammar" 
    pageTitle={pageTitle} 
  />
);

export const ExamPage = ({ dataSource, pageTitle }) => (
  <UniversalPage 
    dataSource={dataSource} 
    layoutType="exam" 
    pageTitle={pageTitle} 
  />
);

export const NavigationPage = ({ dataSource, pageTitle }) => (
  <UniversalPage 
    dataSource={dataSource} 
    layoutType="navigation" 
    pageTitle={pageTitle} 
  />
);

export default UniversalPage;