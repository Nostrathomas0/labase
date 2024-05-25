// PresPerfContPage.js
import React, { useState, useEffect, useCallback } from 'react';
import GrammarTopic from '../../GrammarTopic';
import PresPerfContData from '../../../data/grammar/B1/1PresentPerfectContinuous.json';
import PageTurner from '../../common/PageTurner'

const PresPerfContPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = PresPerfContData;
  useEffect(() => {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Current Questions:`, pages[currentPage]?.questions);
  }, [currentPage, pages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages.length - 1));
  }, [pages]);

  const previousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  }, [pages]);

  if (!pages || pages.length === 0) {
    return <div>No content available.</div>;
  }

  const currentQuestions = pages[currentPage]?.questions || [];
  return (
    <div>
      <h1>Present Perfect Continuous</h1>
      <GrammarTopic contentData={currentQuestions || []} />
   
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default PresPerfContPage;
