import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe, filterState }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.idMeal}`, { state: filterState });
  };

  return (
    <div className="recipe-card" onClick={handleClick}>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="recipe-image"
      />
      <div className="recipe-card-content">
        <h3 className="recipe-name">{recipe.strMeal}</h3>
      </div>
    </div>
  );
};

export default RecipeCard;