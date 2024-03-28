// TopicSelect.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import levels from './data/levels.json';

function LevelSelectionPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  return (
    <div>
      <h1>Select a Level</h1>
      <div>
        {levels.map((level) => (
          <button key={level.level} onClick={() => handleLevelSelect(level)}>
            {level.level}
          </button>
        ))}
      </div>

      {selectedLevel && (
        <div>
          <h2>Topics in {selectedLevel.level}</h2>
          <ul>
            {selectedLevel.topics.map((topic) => (
              <li key={topic.id}>
                <Link to={`/${selectedLevel.level}/${topic.id}`}>{topic.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LevelSelectionPage;