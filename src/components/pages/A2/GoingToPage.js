// CompSupe.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import GoingToData from '../../../data/grammar/A2/3GoingTo.json';
import PageTurner from '../../common/PageTurner'

const GoingToPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = GoingToData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, GoingToData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Going To</h1>
      <GrammarTopic contentData={currentQuestions || []} />
      console.log('rendered')
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={GoingToData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default GoingToPage;
