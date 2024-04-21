import React, { useState } from 'react';

const WordBankActivity = ({ paragraph, wordBank, correctAnswers }) => {
  const [userSelections, setUserSelections] = useState([]);

  const handleWordSelect = (word) => {
    if (!userSelections.includes(word)) {
      setUserSelections(prevSelections => [...prevSelections, word]);
    }
  };

  const removeWord = (index) => {
    const newSelections = [...userSelections];
    newSelections.splice(index, 1);
    setUserSelections(newSelections);
  };

  const moveWord = (index, direction) => {
    const newPosition = index + direction;
    if (newPosition < 0 || newPosition >= userSelections.length) return;

    const newSelections = [...userSelections];
    const temp = newSelections[newPosition];
    newSelections[newPosition] = newSelections[index];
    newSelections[index] = temp;

    setUserSelections(newSelections);
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
    <div>
      <p>{paragraph}</p>
      <div>
        {wordBank.map((word, index) => (
          <button key={index} onClick={() => handleWordSelect(word)}>
            {word}
          </button>
        ))}
      </div>
      <div>
        <h3>Your selections:</h3>
        <ul>
          {userSelections.map((word, index) => (
            <li key={index}>
              {word}
              <button onClick={() => moveWord(index, -1)} disabled={index === 0}>Up</button>
              <button onClick={() => moveWord(index, 1)} disabled={index === userSelections.length - 1}>Down</button>
              <button onClick={() => removeWord(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default WordBankActivity;
