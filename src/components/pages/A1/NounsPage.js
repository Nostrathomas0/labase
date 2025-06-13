//NounsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import GrammarTopic from '../../GrammarTopic';
import NounsData from '../../../data/grammar/A1/1Nouns.json';
import PageTurner from '../../common/PageTurner';
import { ProgressManager } from '../../../utils/ProgressManager';

const NounsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [progressManager] = useState(() => new ProgressManager());
  const { pages } = NounsData;

 useEffect(() => {
  console.log(`Current Page: ${currentPage}`);
  console.log(`Current Questions:`, pages[currentPage]?.questions);
  
  // Start progress tracking session
  progressManager.startSession('A1', 'nouns', currentPage + 1);
}, [currentPage, pages, progressManager]);

  const nextPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages.length - 1));
  }, [pages.length]);

  const previousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  }, []);

  if (!pages || pages.length === 0) {
    return <div>No content available.</div>;
  }

  const currentQuestions = pages[currentPage]?.questions || [];
  return (
    <div>
      <h1>Nouns</h1>
      <div className="progress-display">
        <p>Progress will show here as you answer questions</p>
      </div>
      <GrammarTopic 
        contentData={currentQuestions} 
        progressManager={progressManager}
        level="A1"
        topic="nouns"
        page={currentPage + 1}
      />
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
};

export default NounsPage;
