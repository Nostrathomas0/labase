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
  const [questionHandler, setQuestionHandler] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create handler when progressManager is available
  useEffect(() => {
    if (progressManager && !questionHandler) {
      const handler = new QuestionHandler(progressManager);
      setQuestionHandler(handler);
    }
  }, [progressManager, questionHandler]);

  // Initialize question when handler is ready
  useEffect(() => {
    if (questionId && questionHandler && !isInitialized) {
      console.log('[MultipleChoice] Initializing question:', questionId);
      questionHandler.startQuestion(questionId, 'multipleChoice');
      setIsInitialized(true);
    }
  }, [questionId, questionHandler, isInitialized]);

  const handleOptionClick = (option) => {
    if (answered || !isInitialized) {
      console.log('[MultipleChoice] Click blocked - answered or not initialized');
      return;
    }

    setSelected(option);
    const isCorrect = option === correctAnswer;

    if (questionHandler) {
      try {
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
      } catch (error) {
        console.error('[MultipleChoice] Error handling answer:', error);
      }
    } else if (onAnswer) {
      // Fallback for old system
      onAnswer(isCorrect);
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
            disabled={answered || !isInitialized}
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