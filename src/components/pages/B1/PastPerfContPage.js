// PastPerfContPage.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import PastPerfContData from '../../../data/grammar/B1/2PastPerfectContinuous.json';
import PageTurner from '../../common/PageTurner'

const PastPerfContPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = PastPerfContData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, PastPerfContData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>PastPerfCont</h1>
      <GrammarTopic contentData={currentQuestions || []} />
      console.log('rendered')
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={PastPerfContData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default PastPerfContPage;
