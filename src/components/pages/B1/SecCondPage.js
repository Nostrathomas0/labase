// SecCondPage.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import SecCondData from '../../../data/grammar/B1/3SecondConditional.json';
import PageTurner from '../../common/PageTurner'

const SecCondPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = SecCondData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, SecCondData.pages.length - 1));
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
        totalPages={SecCondData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default SecCondPage;
