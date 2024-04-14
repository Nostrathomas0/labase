// ModalsProbPage.js
import React, { useState } from 'react';
import ModalsProbData from '../../../data/grammar/B2/3ModalsProbability.json';
import GrammarTopic from '../../GrammarTopic';
import PageTurner from '../../common/PageTurner'

const ModalsProbPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = ModalsProbData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, ModalsProbData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Modals of Probability</h1>
      <GrammarTopic contentData={currentQuestions || []} />
      console.log('rendered')
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={ModalsProbData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default ModalsProbPage;
