// src/components/MultipleChoice.js
import React, { useState } from 'react';
function MultipleChoice({ question, options, correctAnswer, onAnswer }) {
  console.log({ question, options, correctAnswer }); // Check received props
  const [selected, setSelected] = useState('');

  const handleOptionClick = (option) => {
    setSelected(option);
    if (onAnswer) {
      const isCorrect = option === correctAnswer;
      onAnswer(isCorrect);
    }
  };

  return (
    <div>
      <p>{question}</p>
      {options.map((option, index) => (
        <button key={index} onClick={() => handleOptionClick(option)} disabled={selected !== ''}>
          {option}
        </button>
      ))}
    </div>
  );
}

export default MultipleChoice;
