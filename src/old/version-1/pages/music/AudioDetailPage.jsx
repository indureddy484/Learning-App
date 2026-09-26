import React from 'react';
import { useParams, Link } from 'react-router-dom';
import audioData from '../../data/audioData';
import './AllDetailPage.css';

const AudioDetailPage = () => {
  const { category, name } = useParams();
  const decodedName = decodeURIComponent(name);

  // ✅ Safe match using lowercase + trim
  const itemData = audioData.find(
    (entry) =>
      entry.category.toLowerCase() === category.toLowerCase() &&
      entry.name.trim().toLowerCase() === decodedName.trim().toLowerCase()
  );

  if (!itemData) {
    return (
      <p style={{ color: 'red', padding: '20px' }}>
        ❌ No data found for this item.
      </p>
    );
  }

  return (
    <div className="audio-detail-page" style={{ padding: '20px' }}>
      <h2>{itemData.name}</h2>
      <p style={{ fontStyle: 'italic', color: '#555' }}>
        {itemData.category.toUpperCase()}
      </p>

      {/* 🎵 Audio player */}
      {Array.isArray(itemData.audio) ? (
        itemData.audio.map((src, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <p>
              <strong>
                {['Pallavi', 'Charanam 1', 'Charanam 2', 'Charanam 3'][index] ||
                  `Part ${index + 1}`}
              </strong>
            </p>
            <audio controls>
              <source src={src} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))
      ) : (
        <audio controls style={{ marginTop: '10px' }}>
          <source src={itemData.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* 📝 Lyrics section */}
      <h3 style={{ marginTop: '30px' }}>📝 Lyrics:</h3>
      <div
        style={{
          marginTop: '10px',
          whiteSpace: 'pre-line',
          fontSize: '18px',
          lineHeight: '1.6',
          background: '#f9f9f9',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        {itemData.text}
      </div>

      <Link
        to="/music/all-audios"
        style={{ marginTop: '20px', display: 'inline-block', color: 'blue' }}
      >
        ← Back to All Audios
      </Link>
    </div>
  );
};

export default AudioDetailPage;
