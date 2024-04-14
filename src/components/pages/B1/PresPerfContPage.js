// PresPerfContPage.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import PresPerfContData from '../../../data/grammar/B1/1PresentPerfectContinuous.json';
import PageTurner from '../../common/PageTurner'

const PresPerfContPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = PresPerfContData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, PresPerfContData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Present Perfect Continuous</h1>
      <GrammarTopic contentData={currentQuestions || []} />
      console.log('rendered')
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={PresPerfContData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default PresPerfContPage;
