import React from 'react';

const PageTurner = ({ currentPage, totalPages, onNext, onPrevious }) => {
  return (
    <div className="page-turner-container">
      <p className="page-info">Page {currentPage} of {totalPages}</p>
      <div className="page-buttons">
        <button
          className="prev-button"
          onClick={onPrevious}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PageTurner;
