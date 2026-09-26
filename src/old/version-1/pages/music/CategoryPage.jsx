import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';
import audioData from '../../data/audioData';

const groupedData = audioData.reduce((acc, item) => {
  acc[item.category] = acc[item.category] || [];
  acc[item.category].push(item);
  return acc;
}, {});

const CategoryPage = () => {
  return (
    <div className="category-page">
      <h1>🎵 Audio Categories</h1>

      <div className="category-container">
        {Object.keys(groupedData).map((category) => (
          <div key={category} className="category-box">
            <h2 className="category-title">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <ul className="subcategory-list">
              {groupedData[category].map((item) => (
                <li key={item.name}>
                  <Link
                    to={`/audio/${item.category}/${encodeURIComponent(item.name)}`}
                    className="subcategory-item"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
