// VerbsPage.js
import React, { useState, useEffect } from 'react';
import GrammarTopic from '../../GrammarTopic';
import VerbsData from '../../../data/grammar/A1/3Verbs.json'; // Import the JSON data
import PageTurner from '../../common/PageTurner'

const VerbsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = VerbsData;
  useEffect(() => {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Current Questions:`, pages[currentPage]?.questions);
  }, [currentPage, pages]);

  if (!pages || pages.length === 0) {
    return <div>No content available.</div>;
  }

  const currentQuestions = pages[currentPage]?.questions || [];

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages.length - 1));
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      <h1>Verbs</h1>
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


export default VerbsPage;
