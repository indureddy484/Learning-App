import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './AllAudiosPage.css';
import audioData from '../../data/audioData';

// Helper hook to read URL query param (?q=...)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const query = useQuery();
  const searchTerm = query.get('q')?.toLowerCase() || '';

  const filteredAudios = audioData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="all-audios-page">
      <h1>🔍 Search Results for: "{searchTerm}"</h1>

      {filteredAudios.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {filteredAudios.map((item) => (
            <li key={item.name} className="audio-item">
              <div className="audio-info">
                <span className="audio-link">{item.name}</span>
                <audio controls>
                  <source src={item.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <Link
                  to={`/audio/${item.category}/${encodeURIComponent(item.name)}`}
                  className="label-link"
                >
                  Text
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
