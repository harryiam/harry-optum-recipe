import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchRecipeDetails } from '../utils/api';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      const data = await fetchRecipeDetails(id);
      setRecipe(data);
      setLoading(false);
    };
    loadRecipe();
  }, [id]);

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

  const handleBackToRecipes = () => {
    navigate('/', { state: location.state });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading recipe...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="app-container">
        <div className="content-wrapper">
          <button onClick={handleBackToRecipes} className="back-button">
            <ArrowLeft size={20} />
            Back to Recipes
          </button>
          <div className="no-recipes">Recipe not found.</div>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(recipe);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <button onClick={handleBackToRecipes} className="back-button">
          <ArrowLeft size={20} />
          Back to Recipes
        </button>
        
        <div className="recipe-detail-card">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="recipe-detail-image"
          />
          
          <div className="recipe-detail-content">
            <h1 className="recipe-title">{recipe.strMeal}</h1>
            
            <div className="recipe-badges">
              <span className="badge category-badge">
                {recipe.strCategory}
              </span>
              {recipe.strTags && (
                recipe.strTags.split(',').map(tag => (
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
                  {recipe.strInstructions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;