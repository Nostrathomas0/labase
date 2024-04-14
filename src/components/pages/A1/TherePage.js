// TherePage.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import ThereData from '../../../data/grammar/A1/4There.json'; // Import the JSON data for nouns
import PageTurner from '../../common/PageTurner'

const TherePage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = ThereData;
  const currentQuestions = pages[currentPage].questions
  console.log('Current Questions:', currentQuestions);
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, ThereData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };
    
  return (
    <div>
      <h1>Here and There</h1>
      <GrammarTopic contentData={currentQuestions || []} />
      console.log('rendered')
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={ThereData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default TherePage;
