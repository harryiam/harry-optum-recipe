// import logo from './logo.svg';
// import './App.css';
// import RecipeBrowser from './Recipie';

// function App() {
//   return (
//     <div className="App">
//       <RecipeBrowser/>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
// import './RecipeBrowser.css';
import './styles/RecipeBrowser.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;