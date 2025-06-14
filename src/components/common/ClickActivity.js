import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Instructions from './Instructions';
import { QuestionHandler } from '../../utils/ProgressManager';

const ClickActivity = ({ 
  instructions = [], 
  words = [], 
  keyWords = [], 
  onAnswer, 
  layout = 'horizontal',
  questionId,
  progressManager 
}) => {
  const [clickedWords, setClickedWords] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

  // Reset state when words or instructions change
  useEffect(() => {
    setClickedWords([]);
    setFeedback('');
    setAnswered(false);
  }, [words, instructions]);

  useEffect(() => {
    // Start tracking this question
    if (questionId && progressManager && questionHandler) {
      questionHandler.startQuestion(questionId, 'clickActivity');
    }
  }, [questionId, progressManager, questionHandler]);

  const handleWordClick = (word) => {
    if (!word || !word.text || answered) {
      console.error('Invalid word or already answered:', word);
      return;
    }

    const isCorrect = keyWords.includes(word.text);
    
    if (progressManager) {
      // New progress tracking system
      const result = questionHandler.handleAnswer(word.text, keyWords, isCorrect);
      setFeedback(result.feedback.message || word.feedback || 'No feedback available');
      
      if (onAnswer) {
        onAnswer({
          questionId,
          isCorrect,
          userAnswer: word.text,
          correctAnswer: keyWords,
          progress: result.progress
        });
      }
    } else {
      // Backward compatibility - old callback system
      setFeedback(word.feedback || 'No feedback available');
      if (onAnswer) {
        onAnswer(isCorrect);
      }
    }

    setClickedWords((prevClickedWords) => [...prevClickedWords, word.text]);
    setAnswered(true);
  };

  const getWordClassName = (word) => {
    if (!clickedWords.includes(word.text)) return 'clickable-word';
    return keyWords.includes(word.text) ? 'clickable-word correct' : 'clickable-word incorrect';
  };

  return (
    <div>
      <Instructions instructions={instructions} />
      <blockquote className={`blockquote words-container ${layout}`}>
        {words.map((word, index) => {
          if (!word || !word.text) {
            console.error('Invalid word in words array:', word);
            return null;
          }

          return (
            <span
              key={index}
              onClick={() => handleWordClick(word)}
              className={`clickable-word ${getWordClassName(word)}`}
              style={{
                cursor: answered ? 'default' : 'pointer',
                margin: '5px',
                color: clickedWords.includes(word.text) ? (keyWords.includes(word.text) ? 'green' : 'red') : 'black',
                opacity: answered && !clickedWords.includes(word.text) ? 0.5 : 1
              }}
            >
              {word.text}
            </span>
          );
        })}
      </blockquote>
      {feedback && (
        <div className="feedback">
          {feedback}
        </div>
      )}
    </div>
  );
};

ClickActivity.propTypes = {
  instructions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      textStyle: PropTypes.string,
      newLine: PropTypes.bool,
      newParagraph: PropTypes.bool
    })
  ),
  words: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      feedback: PropTypes.string
    })
  ),
  keyWords: PropTypes.arrayOf(PropTypes.string),
  onAnswer: PropTypes.func.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  questionId: PropTypes.string,
  progressManager: PropTypes.object
};

export default ClickActivity;