import React, { useState, useEffect } from 'react';
import { QuestionHandler } from '../../utils/ProgressManager';

function MultipleChoice({
  question,
  options,
  correctAnswer,
  questionId,
  progressManager,
  onAnswer
}) {
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

useEffect(() => {
  // Start tracking this question
  if (questionId && progressManager && questionHandler) {
    questionHandler.startQuestion(questionId, 'multipleChoice');
  }
}, [questionId, progressManager, questionHandler]);
  const handleOptionClick = (option) => {
    if (answered) return;

    setSelected(option);
    const isCorrect = option === correctAnswer; // ← Added this line

    if (progressManager) {
      // New progress tracking system
      const result = questionHandler.handleAnswer(option, correctAnswer, isCorrect);
      setFeedback(result.feedback);
      
      if (onAnswer) {
        onAnswer({
          questionId,
          isCorrect,
          userAnswer: option,
          correctAnswer,
          progress: result.progress
        });
      }
    } else {
      // Backward compatibility - old callback system
      if (onAnswer) {
        onAnswer(isCorrect);
      }
    }
    
    setAnswered(true);
  };

  const getOptionClassName = (option) => {
    let className = "multiple-choice-option";
    
    if (answered) {
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
            disabled={answered}
            className={getOptionClassName(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div className={`feedback ${feedback.class}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}

export default MultipleChoice;