// NounsPage.js
import React, { useState } from 'react';
import NounsData from '../../data/grammar/A1/1Nouns.json';
import GrammarTopic from '../GrammarTopic';
import PageTurner from '../PageTurner'; // Import PageTurner component

const NounsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, NounsData.pages.length - 1));
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      <h1>Nouns</h1>
      <GrammarTopic contentData={NounsData.pages[currentPage]} />
      <PageTurner 
        currentPage={currentPage + 1}
        totalPages={NounsData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
};

export default NounsPage;
