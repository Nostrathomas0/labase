// CompSupe.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import FutureData from '../../../data/grammar/A2/2Future.json';
import PageTurner from '../../common/PageTurner'

const FuturePage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = FutureData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, FutureData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Future</h1>
      <GrammarTopic contentData={currentQuestions || []} />
      console.log('rendered')
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={FutureData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default FuturePage;
