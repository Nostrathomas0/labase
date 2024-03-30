// AdjectivesPage.js
import React, { useState} from 'react';
import GrammarTopic from '../GrammarTopic';
import AdjectivesData from '../../data/grammar/A1/2Adjectives.json'; // Import the JSON data for nouns
import PageTurner from '../PageTurner';

const AdjectivesPage = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, AdjectivesData.pages.length - 1));
};

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };  
      
  return (
    <div>
      <h1>Adjectives</h1>
      <GrammarTopic contentData={AdjectivesData.pages[currentPage]} />
      <PageTurner
        currentPage={currentPage + 1}
        totalPages={AdjectivesData.pages.length}
        onNext={nextPage}
        onPrevious={previousPage}
      />  
    </div>
  );
};


export default AdjectivesPage;
