import React from 'react';
import { useNavigate } from 'react-router-dom';

const FourLetterCategory = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="navbar">
        <div className="nav-center">4-Letter Word Blending</div>
        <div className="nav-right">
          <a href="/">Home</a>
          <a href="/">Back</a>
        </div>
      </div>

      <div className="categories">
        <div className="category-box" onClick={() => navigate('/four-letter-consonant')}>Consonant Blends</div>
        <div className="category-box" onClick={() => navigate('/four-letter-vowel')}>Vowel Blends</div>
      </div>
    </div>
  );
};

export default FourLetterCategory;
