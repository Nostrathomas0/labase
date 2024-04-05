// VerbsPage.js
import React, { useState } from 'react';
import GrammarTopic from '../../GrammarTopic';
import VerbsData from '../../../data/grammar/A1/3Verbs.json'; // Import the JSON data for nouns
import PageTurner from '../../common/PageTurner'

const VerbsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, VerbsData.pages.length - 1));
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };
   
  return (
    <div>
      <h1>Verbs</h1>
      <GrammarTopic contentData={VerbsData.pages[currentPage]} />
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={VerbsData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
        />
    </div>
  );
}


export default VerbsPage;