import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import NounsData from '../../../data/grammar/A1/1Nouns.json';
import PageTurner from '../../common/PageTurner'; // Import PageTurner component

const NounsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages } = NounsData;

  if (!pages || pages.length === 0) {
    return <div>No content available.</div>;
  }

  const currentQuestions = pages[currentPage]?.questions || [];
  console.log('Current Questions:', currentQuestions);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages.length - 1));
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      <h1>Nouns</h1>
      <GrammarTopic contentData={currentQuestions} />

      <PageTurner
        currentPage={currentPage + 1}
        totalPages={pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
};

export default NounsPage;
