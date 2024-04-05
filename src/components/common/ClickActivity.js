import React from 'react';
import Instructions from '../GrammarTopic'; // Import the Instructions component

const ClickActivity = ({ instructions, words, keyWords }) => {
  const handleWordClick = (word) => {
    if (keyWords.includes(word)) {
      alert(`Correct! '${word}' is one of the key words.`);
    } else {
      alert(`Try again! '${word}' is not one of the key words.`);
    }
  };

  return (
    <div>
      {/* Use the Instructions component to render the instructions array */}
      <Instructions instructions={instructions} />
      <div>
        {words.map((word, index) => (
          <span key={index} onClick={() => handleWordClick(word)} style={{ cursor: 'pointer', marginRight: '5px' }}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ClickActivity;