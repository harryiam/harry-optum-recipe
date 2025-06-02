import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import { fetchInitialData } from '../utils/api';

const RECIPES_PER_PAGE = 6;

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const saved = localStorage.getItem('selectedCategories');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedTags, setSelectedTags] = useState(() => {
    const saved = localStorage.getItem('selectedTags');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('currentPage');
    return saved ? Number(saved) : 0;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore filter state from navigation or localStorage
  useEffect(() => {
    const state = location.state || {};
    const savedCategories = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
    const savedTags = JSON.parse(localStorage.getItem('selectedTags') || '[]');
    const savedPage = Number(localStorage.getItem('currentPage') || '0');

    setSelectedCategories(state.selectedCategories || savedCategories);
    setSelectedTags(state.selectedTags || savedTags);
    setCurrentPage(state.currentPage !== undefined ? state.currentPage : savedPage);
  }, [location.state]);

  // Save filter state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('currentPage', currentPage);
  }, [selectedCategories, selectedTags, currentPage]);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { categories, recipes, tags } = await fetchInitialData();
      setCategories(categories);
      setAllRecipes(recipes);
      setRecipes(recipes);
      setAvailableTags(tags);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter recipes
  useEffect(() => {
    let filtered = allRecipes;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(recipe => 
        selectedCategories.includes(recipe.strCategory)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(recipe => {
        if (!recipe.strTags) return false;
        const recipeTags = recipe.strTags.split(',').map(tag => tag.trim());
        return selectedTags.some(tag => recipeTags.includes(tag));
      });
    }

    setRecipes(filtered);
    // Ensure currentPage is valid
    const totalPages = Math.ceil(filtered.length / RECIPES_PER_PAGE);
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (totalPages === 0) {
      setCurrentPage(0);
    }
  }, [selectedCategories, selectedTags, allRecipes, currentPage]);

  const handleCategoryFilter = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTagFilter = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setCurrentPage(0);
    // Clear filter-related keys from localStorage
    localStorage.removeItem('selectedCategories');
    localStorage.removeItem('selectedTags');
    localStorage.removeItem('currentPage');
  };

  const getCurrentPageRecipes = () => {
    const startIndex = currentPage * RECIPES_PER_PAGE;
    return recipes.slice(startIndex, startIndex + RECIPES_PER_PAGE);
  };

  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="main-title">Recipe Browser</h1>

        <Filters
          categories={categories}
          availableTags={availableTags}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          handleCategoryFilter={handleCategoryFilter}
          handleTagFilter={handleTagFilter}
          clearFilters={clearFilters}
        />

        {recipes.length === 0 ? (
          <div className="no-recipes">
            No recipes found with the selected filters.
          </div>
        ) : (
          <>
            <div className="recipe-grid">
              {getCurrentPageRecipes().map(recipe => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  filterState={{ selectedCategories, selectedTags, currentPage }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;