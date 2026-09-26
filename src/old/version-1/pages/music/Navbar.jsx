import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">🏠</Link>
        </div>
      <div className="navbar-left">Music App</div>
      <div className="navbar-right">
        <Link to="/music">Home</Link>
        <Link to="/music/all-audios">All Audios</Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search audios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
