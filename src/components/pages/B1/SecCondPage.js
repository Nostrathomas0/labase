// SecCondPage.js
import React, { useState, useEffect, useCallback} from 'react';
import GrammarTopic from '../../GrammarTopic';
import SecCondData from '../../../data/grammar/B1/3SecondConditional.json';
import PageTurner from '../../common/PageTurner'

const SecCondPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = SecCondData;
  useEffect(() => {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Current Questions:`, pages[currentPage]?.questions);
  }, [currentPage, pages]);

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
      <h1>Second Conditional</h1>
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

export default SecCondPage;
