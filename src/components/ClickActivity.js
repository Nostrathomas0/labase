// click.js
import React from 'react';

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
      <p>{instructions}</p>
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