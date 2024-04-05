import React, { useState } from 'react';
import CausitiveData from '../../../data/grammar/B2/2Causitive.json';
import GrammarTopic from '../../GrammarTopic';
import PageTurner from '../../common/PageTurner'

const CausitivePage = () => {
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page within the topic
  const { topic, pages } = CausitiveData; // Destructuring the data; 'topic' will be 'Caustiive' for this page
  const totalPages = pages.length; // Total number of pages within this topic

  // Logic to move to the next page, ensuring we don't go past the last page
  const nextPage = () => setCurrentPage(current => Math.min(current + 1, totalPages - 1));

  // Logic to move to the previous page, ensuring we don't go before the first page
  const prevPage = () => setCurrentPage(current => Math.max(current - 1, 0));

  // Handling the case where there are no pages or data to display
  if (!pages || pages.length === 0) {
    return <div>No pages data available</div>;
  }

 
  return (
    <div>
      <h1>{topic}</h1> {/* Displaying the topic at the top of the page */}
      {/* Rendering the current page's content using the GrammarTopic component */}
      <GrammarTopic topic={topic} contentData={pages[currentPage].questions} />
      {/* PageTurner component to navigate between pages */}
      <PageTurner
        currentPage={currentPage + 1} // +1 because pages are 0-indexed but we want to display starting from 1 for users
        totalPages={totalPages}
        onNext={nextPage}
        onPrevious={prevPage}
      />
    </div>
  );
};

export default CausitivePage;
