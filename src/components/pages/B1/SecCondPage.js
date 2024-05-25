// SecCondPage.js
import React, { useState, useEffect} from 'react';
import GrammarTopic from '../../GrammarTopic';
import SecCondData from '../../../data/grammar/B1/3SecondConditional.json';
import PageTurner from '../../common/PageTurner'

const SecCondPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = SecCondData;
  useEffect(() => {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Current Questions:`, pages[currentPage]?.questions);
  }, [currentPage]);

  if (!pages || pages.length === 0) {
    return <div>No content available.</div>;
  }

  const currentQuestions = pages[currentPage]?.questions || [];

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages.length - 1));
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

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
