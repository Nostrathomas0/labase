// TherePage.js
import React, { useState, useEffect } from 'react';
import GrammarTopic from '../../GrammarTopic';
import ThereData from '../../../data/grammar/A1/4There.json'; // Import the JSON data for nouns
import PageTurner from '../../common/PageTurner'

const TherePage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = ThereData;
  useEffect(() => {
    console.log('Current Page: ${currentPage}');
    console.log('Current Question:', pages[currentPage]?.questions);

  }, [currentPage]);

  if (!pages || pages.length === 0) {
    return <div>No Content</div>;
  }

  const currentQuestions = pages[currentPage]?.questions || [];

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages,length - 1));
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      <h1>Here and There</h1>
      <GrammarTopic contentData={currentQuestions || []} />
      
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
};

export default TherePage;
