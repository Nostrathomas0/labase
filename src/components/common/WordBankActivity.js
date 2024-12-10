
// WordBank.js - Apply Styling for Reduced Visibility Elements
import React, { useState } from 'react';

const WordBankActivity = ({ paragraph, wordBank, correctAnswers, onAnswer }) => {
  const [userSelections, setUserSelections] = useState([]);

  const handleWordSelect = (word) => {
    setUserSelections([...userSelections, word]);
  };

  const handleRemoveWord = (index) => {
    const updatedSelections = [...userSelections];
    updatedSelections.splice(index, 1);
    setUserSelections(updatedSelections);
  };

  const moveWord = (index, direction) => {
    const updatedSelections = [...userSelections];
    const [movedWord] = updatedSelections.splice(index, 1);
    updatedSelections.splice(index + direction, 0, movedWord);
    setUserSelections(updatedSelections);
  };

  const handleSubmit = () => {
    // Count how many are in the correct order
    const correctCount = userSelections.reduce((count, word, index) => {
      return word === correctAnswers[index] ? count + 1 : count;
    }, 0);
    alert(`You got ${correctCount} out of ${correctAnswers.length} correct!`);
    setUserSelections([]); // Reset after submission
  };

  return (
    <div className="wordbank-container">
      <p className="wordbank-paragraph">{paragraph}</p>
      <div className="wordbank-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {wordBank.map((word, index) => (
          <button
            key={index}
            onClick={() => handleWordSelect(word)}
            className="wordbank-option"
            style={{
              fontSize: '8pt', // Reduce font size for word bank options
              padding: '5px 8px',
              width: 'fit-content',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {word}
          </button>
        ))}
      </div>
      <div className="wordbank-operation-message" style={{ fontSize: '8pt', fontWeight: 'normal', marginTop: '10px' }}>
        Your Selections:
      </div>
      <ul className="wordbank-selections" style={{ listStyleType: 'none', padding: 0 }}>
        {userSelections.map((word, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>
            {word}
            <button onClick={() => moveWord(index, -1)} disabled={index === 0} style={{ fontSize: '8pt', marginLeft: '5px' }}>Up</button>
            <button onClick={() => moveWord(index, 1)} disabled={index === userSelections.length - 1} style={{ fontSize: '8pt', marginLeft: '5px' }}>Down</button>
            <button onClick={() => handleRemoveWord(index)} style={{ fontSize: '8pt', marginLeft: '5px' }}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit} style={{ fontSize: '8pt', marginTop: '10px', padding: '5px 10px' }}>Submit</button>
    </div>
  );
};

export default WordBankActivity;
