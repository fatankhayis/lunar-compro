import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-2 rounded ${
            currentPage === i + 1
              ? 'bg-bgtre text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
