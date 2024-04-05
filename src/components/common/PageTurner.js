// PageTurner.js
import React from 'react';

const PageTurner = ({ currentPage, totalPages, onNext, onPrevious }) => {
  return (
    <div>
      <p>Page {currentPage} of {totalPages}</p>
      <button onClick={onPrevious} disabled={currentPage <= 1}>Previous</button>
      <button onClick={onNext} disabled={currentPage >= totalPages}>Next</button>
    </div>
  );
};

export default PageTurner;