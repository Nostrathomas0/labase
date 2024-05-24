import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Instructions from './Instructions';

const ClickActivity = ({ instructions = [], words = [], keyWords = [], onAnswer, layout = 'horizontal' }) => {
  const [clickedWords, setClickedWords] = useState([]);
  const [feedback, setFeedback] = useState('');

  // Reset state when words or instructions change
  useEffect(() => {
    setClickedWords([]);
    setFeedback('');
  }, [words, instructions]);

  const handleWordClick = (word) => {
    if (!word || !word.text) {
      console.error('Invalid word:', word);
      return;
    }

    const isCorrect = keyWords.includes(word.text);
    onAnswer(isCorrect);

    setFeedback(word.feedback || 'No feedback available');
    setClickedWords((prevClickedWords) => [...prevClickedWords, word.text]);
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
              style={{
                cursor: 'pointer',
                margin: '5px',
                color: clickedWords.includes(word.text) ? (keyWords.includes(word.text) ? 'green' : 'red') : 'black'
              }}
            >
              {word.text}
            </span>
          );
        })}
        {feedback && <div className="feedback">{feedback}</div>}
      </blockquote>
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
  layout: PropTypes.oneOf(['horizontal', 'vertical'])
};

export default ClickActivity;
