import React, { useState, useEffect } from 'react';
import { QuestionHandler } from '../../utils/ProgressManager';
import { parseBlanks } from '../utils/popBoxUtils';

const BoxPopActivity = ({
  template,
  options = [],
  correctAnswers = [],
  onAnswer,
  questionId,
  progressManager
}) => {
  const [filled, setFilled] = useState({});   // { blankIndex: tokenValue }
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [dragVal, setDragVal] = useState(null);
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

  useEffect(() => {
    setFilled({});
    setFeedback('');
    setAnswered(false);
  }, [template, correctAnswers]);

  useEffect(() => {
    if (questionId && progressManager && questionHandler) {
      questionHandler.startQuestion(questionId, 'boxPop');
    }
  }, [questionId, progressManager, questionHandler]);

  // template splits on ___ same as GapFill splits on _____
  const segments = parseBlanks(template);
  // → ['The cat sat ', null, ' the mat and ', null, ' it.']

  const handleDrop = (blankIndex) => {
    if (answered || !dragVal) return;
    setFilled(prev => ({ ...prev, [blankIndex]: dragVal }));
    setDragVal(null);
  };

  const handleSubmit = () => {
    if (answered) return;

    const isCorrect = correctAnswers.every(
      (ans, i) => filled[i]?.toLowerCase() === ans.toLowerCase()
    );

    if (progressManager) {
      const result = questionHandler.handleAnswer(
        Object.values(filled),
        correctAnswers,
        isCorrect
      );
      setFeedback(result.feedback.message);
      if (onAnswer) {
        onAnswer({
          questionId,
          isCorrect,
          userAnswer: filled,
          correctAnswer: correctAnswers,
          progress: result.progress
        });
      }
    } else {
      setFeedback(isCorrect ? 'Correct! Great job!' : 'Incorrect. Try again!');
      if (onAnswer) onAnswer(isCorrect);
    }

    setAnswered(true);
  };

  let blankCount = 0;

  return (
    <div className="boxpop-container">

      {/* Inline passage with drop zones */}
      <p className="boxpop-passage">
        {segments.map((seg, i) => {
          if (seg !== null) return <span key={i}>{seg}</span>;
          const idx = blankCount++;
          return (
            <span
              key={i}
              className={`boxpop-drop-zone ${filled[idx] ? 'filled' : ''} ${
                answered
                  ? filled[idx]?.toLowerCase() === correctAnswers[idx]?.toLowerCase()
                    ? 'correct' : 'incorrect'
                  : ''
              }`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
            >
              {filled[idx] || '·····'}
            </span>
          );
        })}
      </p>

      {/* Token bank */}
      <div className="boxpop-token-bank">
        {options.map((opt, i) => (
          <span
            key={i}
            className="boxpop-token"
            draggable={!answered}
            onDragStart={() => setDragVal(opt)}
          >
            {opt}
          </span>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={answered || Object.keys(filled).length < correctAnswers.length}
        className="boxpop-submit"
      >
        Check
      </button>

      {feedback && (
        <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default BoxPopActivity;