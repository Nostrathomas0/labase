// CompSupe.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import PastContData from '../../../data/grammar/A2/1PastContinuous.json';
import PageTurner from '../../common/PageTurner'

const PastContPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = PastContData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, PastContData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Past Continuous</h1>
      <GrammarTopic contentData={currentQuestions || []} />
    
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={PastContData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default PastContPage;
