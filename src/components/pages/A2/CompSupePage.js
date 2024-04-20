// CompSupe.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import CompSupeData from '../../../data/grammar/A2/4ComparativesAndSuperlatives.json';
import PageTurner from '../../common/PageTurner'

const CompSupePage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = CompSupeData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, CompSupeData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

   
  return (
    <div>
      <h1>Comparative and Superlative Adjectives</h1>
      <GrammarTopic contentData={currentQuestions || []} />
     
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={CompSupeData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default CompSupePage;
