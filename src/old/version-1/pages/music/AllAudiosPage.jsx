import React from 'react';
import { Link } from 'react-router-dom';
import './AllAudiosPage.css';
import audioData from '../../data/audioData';

const categories = {
  slokas: '🕉️ Slokas',
  songs: '🎶 Songs',
  swaras: '🎼 Swaras',
};

const AllAudiosPage = () => {
  return (
    <div className="all-audios-page">
      <h1>🎵 All Audios</h1>

      {Object.keys(categories).map((catKey) => (
        <div key={catKey} className="category-section">
          <h2>{categories[catKey]}</h2>
          <ul>
            {audioData
              .filter((item) => item.category === catKey)
              .map((item) => (
                <li key={item.name} className="audio-item">
                  <div className="audio-info">
                    <span className="audio-link">{item.name}</span>

                    {/* 🎧 Play multiple audio files (if array) */}
                    {Array.isArray(item.audio) ? (
                      item.audio.map((src, index) => (
                        <div key={index} style={{ margin: '5px 0' }}>
                          <p style={{ marginBottom: '5px', fontSize: '14px', color: '#555' }}>
                            {['Pallavi', 'Charanam 1', 'Charanam 2', 'Charanam 3'][index] || `Part ${index + 1}`}
                          </p>
                          <audio controls>
                            <source src={item.audio} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ))
                    ) : (
                      <audio controls>
                        <source src={item.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}

                    <Link
                      to={`/audio/${item.category}/${encodeURIComponent(item.name)}`}
                      className="label-link"
                    >
                      Lyrics
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AllAudiosPage;
