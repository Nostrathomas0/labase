// PastPerfContPage.js
import React, { useState, useEffect, useCallback} from 'react';
import GrammarTopic from '../../GrammarTopic';
import PastPerfContData from '../../../data/grammar/B1/2PastPerfectContinuous.json';
import PageTurner from '../../common/PageTurner'

const PastPerfContPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = PastPerfContData;
  useEffect(() => {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Current Questions:`, pages[currentPage]?.questions);
  }, [currentPage, pages]);

  if (!pages || pages.length === 0) {
    return <div>No content available.</div>;
  }

  const currentQuestions = pages[currentPage]?.questions || [];

  // Memoize the nextPage function to avoid unnecessary re-renders
  const nextPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages.length - 1));
  }, [pages]);

  // Memoize the previousPage function to avoid unnecessary re-renders
  const previousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  }, [pages]);


  return (
    <div>
      <h1>PastPerfCont</h1>
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

export default PastPerfContPage;
