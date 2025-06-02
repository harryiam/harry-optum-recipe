import React from 'react';
import { X } from 'lucide-react';

const Filters = ({ 
  categories, 
  availableTags, 
  selectedCategories, 
  selectedTags, 
  handleCategoryFilter, 
  handleTagFilter, 
  clearFilters 
}) => {
  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2 className="filters-title">Filters</h2>
        {(selectedCategories.length > 0 || selectedTags.length > 0) && (
          <button onClick={clearFilters} className="clear-filters-button">
            <X size={16} />
            Clear All
          </button>
        )}
      </div>
      
      <div className="filter-group">
        <h3 className="filter-group-title">Categories</h3>
        <div className="filter-buttons">
          {categories.slice(0, 8).map(category => (
            <button
              key={category.idCategory}
              onClick={() => handleCategoryFilter(category.strCategory)}
              className={`filter-button ${
                selectedCategories.includes(category.strCategory)
                  ? 'filter-button-active'
                  : ''
              }`}
            >
              {category.strCategory}
            </button>
          ))}
        </div>
      </div>
      
      {availableTags.length > 0 && (
        <div className="filter-group">
          <h3 className="filter-group-title">Tags</h3>
          <div className="filter-buttons">
            {availableTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`filter-button tag-filter ${
                  selectedTags.includes(tag)
                    ? 'tag-filter-active'
                    : ''
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;