// src/components/common/MatchingPairs.js
import React, { useState, useEffect } from 'react';
import { QuestionHandler } from '../../utils/ProgressManager';

// pairs format: [{ left: 'my', right: 'I' }, { left: 'your', right: 'you' }, ...]
const MatchingPairs = ({
  pairs = [],
  onAnswer,
  questionId,
  progressManager
}) => {
  const [selected, setSelected] = useState(null); // { side: 'left'|'right', value }
  const [matched, setMatched] = useState({});     // { leftValue: rightValue }
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

  const rightItems = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);

  useEffect(() => {
    setSelected(null);
    setMatched({});
    setAnswered(false);
    setFeedback('');
  }, [pairs]);

  useEffect(() => {
    if (questionId && progressManager) {
      questionHandler.startQuestion(questionId, 'matchingPairs');
    }
  }, [questionId, progressManager, questionHandler]);

  const handleSelect = (side, value) => {
    if (answered) return;

    if (!selected) {
      setSelected({ side, value });
      return;
    }

    // Same side — reselect
    if (selected.side === side) {
      setSelected({ side, value });
      return;
    }

    // Opposite side — form a pair
    const leftVal  = side === 'left'  ? value : selected.value;
    const rightVal = side === 'right' ? value : selected.value;
    setMatched(prev => ({ ...prev, [leftVal]: rightVal }));
    setSelected(null);

    // Auto-submit when all pairs matched
    if (Object.keys(matched).length + 1 === pairs.length) {
      submitAnswers({ ...matched, [leftVal]: rightVal });
    }
  };

  const submitAnswers = (finalMatched) => {
    const isCorrect = pairs.every(p => finalMatched[p.left] === p.right);

    if (progressManager) {
      const result = questionHandler.handleAnswer(finalMatched, pairs, isCorrect);
      setFeedback(result.feedback.message);
      if (onAnswer) {
        onAnswer({
          questionId,
          isCorrect,
          userAnswer: finalMatched,
          correctAnswer: pairs,
          progress: result.progress
        });
      }
    } else {
      setFeedback(isCorrect ? 'Correct! Great job!' : 'Incorrect. Try again!');
      if (onAnswer) onAnswer(isCorrect);
    }

    setAnswered(true);
  };

  const getStatus = (left) => {
    if (!answered || !matched[left]) return '';
    const correct = pairs.find(p => p.left === left)?.right;
    return matched[left] === correct ? 'correct' : 'incorrect';
  };

  return (
    <div className="matching-pairs">
      <div className="pairs-columns">

        <div className="pairs-left">
          {pairs.map((pair, i) => (
            <div
              key={i}
              className={`pair-item ${selected?.value === pair.left ? 'selected' : ''} ${getStatus(pair.left)}`}
              onClick={() => handleSelect('left', pair.left)}
            >
              {pair.left}
              {matched[pair.left] && (
                <span className="matched-right"> → {matched[pair.left]}</span>
              )}
            </div>
          ))}
        </div>

        <div className="pairs-right">
          {rightItems.map((item, i) => {
            const alreadyMatched = Object.values(matched).includes(item);
            return (
              <div
                key={i}
                className={`pair-item ${selected?.value === item ? 'selected' : ''} ${alreadyMatched ? 'used' : ''}`}
                onClick={() => !alreadyMatched && handleSelect('right', item)}
              >
                {item}
              </div>
            );
          })}
        </div>

      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default MatchingPairs;