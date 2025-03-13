import React, { useState, useEffect } from 'react';

function MultipleChoice({ question, options, correctAnswer, onAnswer }) {
  const [selected, setSelected] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  // Reset state when question or options change
  useEffect(() => {
    setSelected('');
    setFeedbackGiven(false);
  }, [question, options]);

  const handleOptionClick = (option) => {
    setSelected(option);
    if (onAnswer) {
      const isCorrect = option === correctAnswer;
      onAnswer(isCorrect);
      setFeedbackGiven(true); // Enables Visual Feedback
    }
  };

  const getOptionClassName = (option) => {
    let className = "multiple-choice-option";
    
    if (feedbackGiven) {
      if (option === correctAnswer) {
        className += " correct";
      } else if (option === selected) {
        className += " incorrect";
      }
    }
    
    if (option === selected) {
      className += " selected";
    }
    
    return className;
  };
  return (
    <div className="multiple-choice-container">
      <p className="multiple-choice-question">{question}</p>
      <div className="multiple-choice-options">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={feedbackGiven}
            className={getOptionClassName(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MultipleChoice;