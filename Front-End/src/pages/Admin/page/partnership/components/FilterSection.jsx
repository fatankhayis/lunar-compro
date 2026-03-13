import React from 'react';

const FilterSection = ({ categories, selectedCategory, onCategoryFilter, onClearFilter }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onClearFilter}
          className={`px-4 py-2 rounded-md transition ${
            selectedCategory === ''
              ? 'bg-bgtre text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category.category_id}
            onClick={() => onCategoryFilter(category.category_id)}
            className={`px-4 py-2 rounded-md transition ${
              selectedCategory === category.category_id.toString()
                ? 'bg-bgtre text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <span>Showing partnerships from:</span>
          <span className="font-medium text-bgtre">
            {categories.find(cat => cat.category_id.toString() === selectedCategory)?.name}
          </span>
          <button
            onClick={onClearFilter}
            className="ml-2 text-xs text-red-500 hover:text-red-700"
          >
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSection;