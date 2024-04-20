import React, { useState } from 'react';
import MixedCondData from '../../../data/grammar/B2/1MixedConditionals.json';
import GrammarTopic from '../../GrammarTopic';
import PageTurner from '../../common/PageTurner'

const MixedCondPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = MixedCondData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, MixedCondData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Mixed Conditionals</h1>
      <GrammarTopic contentData={currentQuestions || []} />
        <PageTurner
        currentPage={currentPage + 1}
        totalPages={MixedCondData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default MixedCondPage;
