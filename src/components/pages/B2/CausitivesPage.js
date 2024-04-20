import React, { useState } from 'react';
import CausitiveData from '../../../data/grammar/B2/2Causitive.json';
import GrammarTopic from '../../GrammarTopic';
import PageTurner from '../../common/PageTurner'

const CausitivePage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = CausitiveData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, CausitiveData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Causitive</h1>
      <GrammarTopic contentData={currentQuestions || []} />
   
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={CausitiveData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default CausitivePage;
