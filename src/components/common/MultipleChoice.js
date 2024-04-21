// src/components/MultipleChoice.js
import React, { useState } from 'react';

function MultipleChoice({ question, options, correctAnswer, onAnswer }) {
  console.log({ question, options, correctAnswer }); // Check received props
  const [selected, setSelected] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleOptionClick = (option) => {
    setSelected(option);
    if (onAnswer) {
      const isCorrect = option === correctAnswer;
      onAnswer(isCorrect);
      setFeedbackGiven(true); // Enables Visual Feedback
    }
  };

  return (
    <div>
      <p>{question}</p>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option)}
          disabled={feedbackGiven} // Disables changing the answer after selection if feedback is given
          style={{
            backgroundColor: feedbackGiven ? (option === correctAnswer ? 'lightgreen' : (option === selected ? 'salmon' : '')) : '',
            borderColor: option === selected ? 'blue' : ''
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}


export default MultipleChoice;
