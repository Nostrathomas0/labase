import React, { useState, useEffect } from 'react';
import { QuestionHandler } from '../../utils/ProgressManager';

const WordBankActivity = ({ 
  paragraph, 
  wordBank, 
  correctAnswers, 
  onAnswer,
  questionId,
  progressManager 
}) => {
  const [userSelections, setUserSelections] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

  useEffect(() => {
    setUserSelections([]);
    setFeedback('');
    setAnswered(false);
  }, [paragraph, wordBank, correctAnswers]);

  useEffect(() => {
    // Start tracking this question
    if (questionId && progressManager && questionHandler) {
      questionHandler.startQuestion(questionId, 'wordBank');
    }
  }, [questionId, progressManager, questionHandler]);

  const handleWordSelect = (word) => {
    if (answered) return;
    setUserSelections([...userSelections, word]);
  };

  const handleRemoveWord = (index) => {
    if (answered) return;
    const updatedSelections = [...userSelections];
    updatedSelections.splice(index, 1);
    setUserSelections(updatedSelections);
  };

  const moveWord = (index, direction) => {
    if (answered) return;
    const updatedSelections = [...userSelections];
    const [movedWord] = updatedSelections.splice(index, 1);
    updatedSelections.splice(index + direction, 0, movedWord);
    setUserSelections(updatedSelections);
  };

  const handleSubmit = () => {
    if (answered) return;

    // Count how many are in the correct order
    const correctCount = userSelections.reduce((count, word, index) => {
      return word === correctAnswers[index] ? count + 1 : count;
    }, 0);
    
    const isCorrect = correctCount === correctAnswers.length;
    const score = correctCount / correctAnswers.length;

    if (progressManager) {
      // New progress tracking system
      const result = questionHandler.handleAnswer(userSelections, correctAnswers, isCorrect, score);
      setFeedback(result.feedback.message || `You got ${correctCount} out of ${correctAnswers.length} correct!`);
      
      if (onAnswer) {
        onAnswer({
          questionId,
          isCorrect,
          userAnswer: userSelections,
          correctAnswer: correctAnswers,
          score: score,
          progress: result.progress
        });
      }
    } else {
      // Backward compatibility - old callback system
      setFeedback(`You got ${correctCount} out of ${correctAnswers.length} correct!`);
      if (onAnswer) {
        onAnswer(isCorrect);
      }
    }

    setAnswered(true);
  };

  const getSelectionClassName = (word, index) => {
    if (!answered) return '';
    return word === correctAnswers[index] ? 'correct' : 'incorrect';
  };

  return (
    <div className="wordbank-container">
      <p className="wordbank-paragraph">{paragraph}</p>
      
      <div className="wordbank-options" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        justifyContent: 'center',
        opacity: answered ? 0.6 : 1 
      }}>
        {wordBank.map((word, index) => (
          <button
            key={index}
            onClick={() => handleWordSelect(word)}
            disabled={answered}
            className="wordbank-option"
            style={{
              fontSize: '8pt',
              padding: '5px 8px',
              width: 'fit-content',
              borderRadius: '5px',
              cursor: answered ? 'default' : 'pointer'
            }}
          >
            {word}
          </button>
        ))}
      </div>
      
      <div className="wordbank-operation-message" style={{ 
        fontSize: '8pt', 
        fontWeight: 'normal', 
        marginTop: '10px' 
      }}>
        Your Selections:
      </div>
      
      <ul className="wordbank-selections" style={{ 
        listStyleType: 'none', 
        padding: 0 
      }}>
        {userSelections.map((word, index) => (
          <li 
            key={index} 
            className={getSelectionClassName(word, index)}
            style={{ 
              marginBottom: '5px',
              padding: '5px',
              backgroundColor: answered ? 
                (word === correctAnswers[index] ? '#d4edda' : '#f8d7da') : 
                'transparent',
              borderRadius: '3px'
            }}
          >
            {word}
            <button 
              onClick={() => moveWord(index, -1)} 
              disabled={index === 0 || answered} 
              style={{ fontSize: '8pt', marginLeft: '5px' }}
            >
              Up
            </button>
            <button 
              onClick={() => moveWord(index, 1)} 
              disabled={index === userSelections.length - 1 || answered} 
              style={{ fontSize: '8pt', marginLeft: '5px' }}
            >
              Down
            </button>
            <button 
              onClick={() => handleRemoveWord(index)} 
              disabled={answered}
              style={{ fontSize: '8pt', marginLeft: '5px' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={handleSubmit} 
        disabled={answered || userSelections.length === 0}
        className="wordbank-submit"
        style={{ 
          fontSize: '8pt', 
          marginTop: '10px', 
          padding: '5px 10px' 
        }}
      >
        Submit
      </button>
      
      {feedback && (
        <div className={`feedback ${answered ? 'show' : ''}`} style={{ marginTop: '10px' }}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default WordBankActivity;