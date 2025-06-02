// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';

// const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

// const RecipeBrowser = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [allRecipes, setAllRecipes] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [availableTags, setAvailableTags] = useState([]);

//   const RECIPES_PER_PAGE = 6;

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch categories
//         const categoriesResponse = await fetch(`${API_BASE}/categories.php`);
//         const categoriesData = await categoriesResponse.json();
//         setCategories(categoriesData.categories || []);

//         // Fetch a mix of specific recipes and random ones to show variety
//         const specificRecipes = [
//           fetch(`${API_BASE}/search.php?s=Arrabiata`),
//           fetch(`${API_BASE}/search.php?s=Carbonara`),
//           fetch(`${API_BASE}/search.php?s=Chicken`),
//           fetch(`${API_BASE}/filter.php?c=Seafood`),
//           fetch(`${API_BASE}/filter.php?c=Vegetarian`)
//         ];

//         const responses = await Promise.all(specificRecipes);
//         const data = await Promise.all(responses.map(r => r.json()));
        
//         let fetchedRecipes = [];
//         data.forEach(response => {
//           if (response.meals) {
//             fetchedRecipes.push(...response.meals.slice(0, 4));
//           }
//         });

//         // Add some random recipes to fill out the collection
//         const randomPromises = Array.from({ length: 5 }, () => 
//           fetch(`${API_BASE}/random.php`).then(res => res.json())
//         );
        
//         const randomResponses = await Promise.all(randomPromises);
//         const randomRecipes = randomResponses
//           .map(response => response.meals?.[0])
//           .filter(Boolean);

//         fetchedRecipes.push(...randomRecipes);
        
//         // Remove duplicates based on meal ID
//         const uniqueRecipes = fetchedRecipes.filter((recipe, index, self) => 
//           index === self.findIndex(r => r.idMeal === recipe.idMeal)
//         );

//         setAllRecipes(uniqueRecipes);
//         setRecipes(uniqueRecipes);

//         // Extract unique tags
//         const tags = new Set();
//         uniqueRecipes.forEach(recipe => {
//           if (recipe.strTags) {
//             recipe.strTags.split(',').forEach(tag => tags.add(tag.trim()));
//           }
//         });
//         setAvailableTags(Array.from(tags));

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         // Fallback to demo data if API fails
//         setAllRecipes([]);
//         setRecipes([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Filter recipes based on selected categories and tags
//   useEffect(() => {
//     let filtered = allRecipes;

//     if (selectedCategories.length > 0) {
//       filtered = filtered.filter(recipe => 
//         selectedCategories.includes(recipe.strCategory)
//       );
//     }

//     if (selectedTags.length > 0) {
//       filtered = filtered.filter(recipe => {
//         if (!recipe.strTags) return false;
//         const recipeTags = recipe.strTags.split(',').map(tag => tag.trim());
//         return selectedTags.some(tag => recipeTags.includes(tag));
//       });
//     }

//     setRecipes(filtered);
//     setCurrentPage(0);
//   }, [selectedCategories, selectedTags, allRecipes]);

//   const handleCategoryFilter = (category) => {
//     setSelectedCategories(prev => 
//       prev.includes(category)
//         ? prev.filter(c => c !== category)
//         : [...prev, category]
//     );
//   };

//   const handleTagFilter = (tag) => {
//     setSelectedTags(prev => 
//       prev.includes(tag)
//         ? prev.filter(t => t !== tag)
//         : [...prev, tag]
//     );
//   };

//   const clearFilters = () => {
//     setSelectedCategories([]);
//     setSelectedTags([]);
//   };

//   const getCurrentPageRecipes = () => {
//     const startIndex = currentPage * RECIPES_PER_PAGE;
//     return recipes.slice(startIndex, startIndex + RECIPES_PER_PAGE);
//   };

//   const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);

//   const handleNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage(prev => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage(prev => prev - 1);
//     }
//   };

//   const handleRecipeClick = async (recipeId) => {
//     try {
//       const response = await fetch(`${API_BASE}/lookup.php?i=${recipeId}`);
//       const data = await response.json();
//       setSelectedRecipe(data.meals?.[0] || null);
//     } catch (error) {
//       console.error('Error fetching recipe details:', error);
//     }
//   };

//   const handleBackToRecipes = () => {
//     setSelectedRecipe(null);
//   };

//   const getIngredients = (recipe) => {
//     const ingredients = [];
//     for (let i = 1; i <= 20; i++) {
//       const ingredient = recipe[`strIngredient${i}`];
//       const measure = recipe[`strMeasure${i}`];
//       if (ingredient && ingredient.trim()) {
//         ingredients.push({
//           ingredient: ingredient.trim(),
//           measure: measure ? measure.trim() : ''
//         });
//       }
//     }
//     return ingredients;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl text-gray-600">Loading recipes...</div>
//       </div>
//     );
//   }

//   if (selectedRecipe) {
//     const ingredients = getIngredients(selectedRecipe);
    
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-4xl mx-auto">
//           <button
//             onClick={handleBackToRecipes}
//             className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             <ArrowLeft size={20} />
//             Back to Recipes
//           </button>
          
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <img
//               src={selectedRecipe.strMealThumb}
//               alt={selectedRecipe.strMeal}
//               className="w-full h-64 object-cover"
//             />
            
//             <div className="p-6">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 {selectedRecipe.strMeal}
//               </h1>
              
//               <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
//                 <span className="bg-blue-100 px-3 py-1 rounded-full">
//                   {selectedRecipe.strCategory}
//                 </span>
//                 {selectedRecipe.strTags && (
//                   selectedRecipe.strTags.split(',').map(tag => (
//                     <span key={tag.trim()} className="bg-green-100 px-3 py-1 rounded-full">
//                       {tag.trim()}
//                     </span>
//                   ))
//                 )}
//               </div>
              
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div>
//                   <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
//                   <ul className="space-y-2">
//                     {ingredients.map((item, index) => (
//                       <li key={index} className="flex justify-between">
//                         <span>{item.ingredient}</span>
//                         <span className="text-gray-600">{item.measure}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h2 className="text-xl font-semibold mb-4">Instructions</h2>
//                   <div className="text-gray-700 leading-relaxed whitespace-pre-line">
//                     {selectedRecipe.strInstructions}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Recipe Browser</h1>
        
//         {/* Demo Button */}
//         <div className="text-center mb-6">
//           <button
//             onClick={() => handleRecipeClick('52771')} // Spicy Arrabiata Penne
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             View Sample Recipe (Spicy Arrabiata Penne)
//           </button>
//         </div>
        
//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Filters</h2>
//             {(selectedCategories.length > 0 || selectedTags.length > 0) && (
//               <button
//                 onClick={clearFilters}
//                 className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
//               >
//                 <X size={16} />
//                 Clear All
//               </button>
//             )}
//           </div>
          
//           {/* Category Filters */}
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
//             <div className="flex flex-wrap gap-2">
//               {categories.slice(0, 8).map(category => (
//                 <button
//                   key={category.idCategory}
//                   onClick={() => handleCategoryFilter(category.strCategory)}
//                   className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                     selectedCategories.includes(category.strCategory)
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   {category.strCategory}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {/* Tag Filters */}
//           {availableTags.length > 0 && (
//             <div>
//               <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
//               <div className="flex flex-wrap gap-2">
//                 {availableTags.slice(0, 10).map(tag => (
//                   <button
//                     key={tag}
//                     onClick={() => handleTagFilter(tag)}
//                     className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                       selectedTags.includes(tag)
//                         ? 'bg-green-600 text-white'
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     {tag}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Recipe Grid */}
//         {recipes.length === 0 ? (
//           <div className="text-center text-gray-600 py-12">
//             No recipes found with the selected filters.
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               {getCurrentPageRecipes().map(recipe => (
//                 <div
//                   key={recipe.idMeal}
//                   className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
//                   onClick={() => handleRecipeClick(recipe.idMeal)}
//                 >
//                   <img
//                     src={recipe.strMealThumb}
//                     alt={recipe.strMeal}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-800 truncate">
//                       {recipe.strMeal}
//                     </h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center gap-4">
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 0}
//                   className="flex items-center gap-1 px-4 py-2 bg-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 >
//                   <ChevronLeft size={20} />
//                   Previous
//                 </button>
                
//                 <span className="text-gray-600">
//                   Page {currentPage + 1} of {totalPages}
//                 </span>
                
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage === totalPages - 1}
//                   className="flex items-center gap-1 px-4 py-2 bg-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 >
//                   Next
//                   <ChevronRight size={20} />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecipeBrowser;


import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';
import './RecipeBrowser.css';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

const RecipeBrowser = () => {
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);

  const RECIPES_PER_PAGE = 6;

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch(`${API_BASE}/categories.php`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);

        // Fetch a mix of specific recipes and random ones to show variety
        const specificRecipes = [
          fetch(`${API_BASE}/search.php?s=Arrabiata`),
          fetch(`${API_BASE}/search.php?s=Carbonara`),
          fetch(`${API_BASE}/search.php?s=Chicken`),
          fetch(`${API_BASE}/filter.php?c=Seafood`),
          fetch(`${API_BASE}/filter.php?c=Vegetarian`)
        ];

        const responses = await Promise.all(specificRecipes);
        const data = await Promise.all(responses.map(r => r.json()));
        
        let fetchedRecipes = [];
        data.forEach(response => {
          if (response.meals) {
            fetchedRecipes.push(...response.meals.slice(0, 4));
          }
        });

        // Add some random recipes to fill out the collection
        const randomPromises = Array.from({ length: 5 }, () => 
          fetch(`${API_BASE}/random.php`).then(res => res.json())
        );
        
        const randomResponses = await Promise.all(randomPromises);
        const randomRecipes = randomResponses
          .map(response => response.meals?.[0])
          .filter(Boolean);

        fetchedRecipes.push(...randomRecipes);
        
        // Remove duplicates based on meal ID
        const uniqueRecipes = fetchedRecipes.filter((recipe, index, self) => 
          index === self.findIndex(r => r.idMeal === recipe.idMeal)
        );

        setAllRecipes(uniqueRecipes);
        setRecipes(uniqueRecipes);

        // Extract unique tags
        const tags = new Set();
        uniqueRecipes.forEach(recipe => {
          if (recipe.strTags) {
            recipe.strTags.split(',').forEach(tag => tags.add(tag.trim()));
          }
        });
        setAvailableTags(Array.from(tags));

      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to demo data if API fails
        setAllRecipes([]);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter recipes based on selected categories and tags
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
    setCurrentPage(0);
  }, [selectedCategories, selectedTags, allRecipes]);

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

  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await fetch(`${API_BASE}/lookup.php?i=${recipeId}`);
      const data = await response.json();
      setSelectedRecipe(data.meals?.[0] || null);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  const getIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading recipes...</div>
      </div>
    );
  }

  if (selectedRecipe) {
    const ingredients = getIngredients(selectedRecipe);
    
    return (
      <div className="app-container">
        <div className="content-wrapper">
          <button onClick={handleBackToRecipes} className="back-button">
            <ArrowLeft size={20} />
            Back to Recipes
          </button>
          
          <div className="recipe-detail-card">
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              className="recipe-detail-image"
            />
            
            <div className="recipe-detail-content">
              <h1 className="recipe-title">{selectedRecipe.strMeal}</h1>
              
              <div className="recipe-badges">
                <span className="badge category-badge">
                  {selectedRecipe.strCategory}
                </span>
                {selectedRecipe.strTags && (
                  selectedRecipe.strTags.split(',').map(tag => (
                    <span key={tag.trim()} className="badge tag-badge">
                      {tag.trim()}
                    </span>
                  ))
                )}
              </div>
              
              <div className="recipe-details-grid">
                <div className="ingredients-section">
                  <h2 className="section-title">Ingredients</h2>
                  <ul className="ingredients-list">
                    {ingredients.map((item, index) => (
                      <li key={index} className="ingredient-item">
                        <span className="ingredient-name">{item.ingredient}</span>
                        <span className="ingredient-measure">{item.measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="instructions-section">
                  <h2 className="section-title">Instructions</h2>
                  <div className="instructions-text">
                    {selectedRecipe.strInstructions}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="main-title">Recipe Browser</h1>
        
       
        {/* Filters */}
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
          
          {/* Category Filters */}
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
          
          {/* Tag Filters */}
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
        
        {/* Recipe Grid */}
        {recipes.length === 0 ? (
          <div className="no-recipes">
            No recipes found with the selected filters.
          </div>
        ) : (
          <>
            <div className="recipe-grid">
              {getCurrentPageRecipes().map(recipe => (
                <div
                  key={recipe.idMeal}
                  className="recipe-card"
                  onClick={() => handleRecipeClick(recipe.idMeal)}
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="recipe-image"
                  />
                  <div className="recipe-card-content">
                    <h3 className="recipe-name">{recipe.strMeal}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeBrowser;