import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, handlePrevPage, handleNextPage }) => {
  return (
    <div className="pagination">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 0}
        className="pagination-button"
      >
        <ChevronLeft size={20} />
        Previous
      </button>
      
      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages}
      </span>
      
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages - 1}
        className="pagination-button"
      >
        Next
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;