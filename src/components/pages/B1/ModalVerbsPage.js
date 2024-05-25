// ModalVerbsPage.js
import React, { useState, useEffect } from 'react';
import GrammarTopic from '../../GrammarTopic';
import ModalVerbsData from '../../../data/grammar/B1/4ModalVerbs.json';
import PageTurner from '../../common/PageTurner'

const ModalVerbsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = ModalVerbsData;
  useEffect(() => {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Current Questions:`, pages[currentPage]?.questions);
  }, [currentPage]);

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
      <h1>Modal Verbs</h1>
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

export default ModalVerbsPage;
