const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

export const fetchInitialData = async () => {
  try {
    // Fetch categories
    const categoriesResponse = await fetch(`${API_BASE}/categories.php`);
    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.categories || [];

    // Fetch a mix of specific recipes and random ones
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

    // Add random recipes
    const randomPromises = Array.from({ length: 5 }, () => 
      fetch(`${API_BASE}/random.php`).then(res => res.json())
    );
    
    const randomResponses = await Promise.all(randomPromises);
    const randomRecipes = randomResponses
      .map(response => response.meals?.[0])
      .filter(Boolean);

    fetchedRecipes.push(...randomRecipes);
    
    // Remove duplicates
    const uniqueRecipes = fetchedRecipes.filter((recipe, index, self) => 
      index === self.findIndex(r => r.idMeal === recipe.idMeal)
    );

    // Extract unique tags
    const tags = new Set();
    uniqueRecipes.forEach(recipe => {
      if (recipe.strTags) {
        recipe.strTags.split(',').forEach(tag => tags.add(tag.trim()));
      }
    });

    return {
      categories,
      recipes: uniqueRecipes,
      tags: Array.from(tags)
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { categories: [], recipes: [], tags: [] };
  }
};

export const fetchRecipeDetails = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${recipeId}`);
    const data = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};