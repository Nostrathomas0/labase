// WordBankActivity.js
import React, { useState } from 'react';

const WordBankActivity = ({ paragraph, wordBank, correctAnswers }) => {
  const [selectedWords, setSelectedWords] = useState([]);

  const handleWordSelect = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSubmit = () => {
    const isCorrect = selectedWords.every((word, index) => correctAnswers[index] === word);
    alert(isCorrect ? 'Correct!' : 'Try again!');
  };

  return (
    <div>
      <p>{paragraph}</p>
      <div>
        {wordBank.map((word, index) => (
          <button key={index} onClick={() => handleWordSelect(word)}>
            {word}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default WordBankActivity;
