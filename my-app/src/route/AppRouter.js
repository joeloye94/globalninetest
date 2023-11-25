// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components
import HomePage from '../view/HomePage';
import DetailsPage from '../view/DetailsPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/:itemID" element={<DetailsPage></DetailsPage>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;