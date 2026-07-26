// src/components/common/SentenceBuilder.js
import React, { useState, useEffect } from 'react';
import { QuestionHandler } from '../../utils/ProgressManager';

const SentenceBuilder = ({
  tokens = [],       // shuffled word array e.g. ['table', 'the', 'on', 'is', 'book', 'Her']
  correctOrder = [], // correct sequence e.g. ['Her', 'book', 'is', 'on', 'the', 'table']
  onAnswer,
  questionId,
  progressManager
}) => {
  const [bank, setBank] = useState([...tokens]);
  const [built, setBuilt] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [dragVal, setDragVal] = useState(null);
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

  useEffect(() => {
    setBank([...tokens]);
    setBuilt([]);
    setAnswered(false);
    setFeedback('');
  }, [tokens, correctOrder]);

  useEffect(() => {
    if (questionId && progressManager && questionHandler) {
      questionHandler.startQuestion(questionId, 'sentenceBuilder');
    }
  }, [questionId, progressManager, questionHandler]);

  const moveToBuilt = (token, fromBank = true) => {
    if (answered) return;
    if (fromBank) {
      setBank(prev => prev.filter((_, i) => i !== prev.indexOf(token)));
      setBuilt(prev => [...prev, token]);
    } else {
      setBuilt(prev => prev.filter((_, i) => i !== prev.indexOf(token)));
      setBank(prev => [...prev, token]);
    }
  };

  const handleSubmit = () => {
    if (answered) return;
    const isCorrect = built.join(' ') === correctOrder.join(' ');

    if (progressManager) {
      const result = questionHandler.handleAnswer(built, correctOrder, isCorrect);
      setFeedback(result.feedback.message);
      if (onAnswer) {
        onAnswer({
          questionId,
          isCorrect,
          userAnswer: built,
          correctAnswer: correctOrder,
          progress: result.progress
        });
      }
    } else {
      setFeedback(isCorrect ? 'Correct! Great job!' : 'Incorrect. Try again!');
      if (onAnswer) onAnswer(isCorrect);
    }

    setAnswered(true);
  };

  return (
    <div className="sentence-builder">

      {/* Construction zone — drop tokens here in order */}
      <div
        className="builder-zone"
        onDragOver={e => e.preventDefault()}
        onDrop={() => dragVal && moveToBuilt(dragVal, true)}
      >
        {built.length === 0
          ? <span className="builder-placeholder">Drag words here to build the sentence</span>
          : built.map((token, i) => (
            <span
              key={i}
              className="builder-token"
              draggable={!answered}
              onDragStart={() => setDragVal(token)}
              onDrop={e => { e.stopPropagation(); moveToBuilt(dragVal, true); }}
              onClick={() => !answered && moveToBuilt(token, false)}
            >
              {token}
            </span>
          ))
        }
      </div>

      {/* Word bank */}
      <div
        className="sentence-token-bank"
        onDragOver={e => e.preventDefault()}
        onDrop={() => dragVal && moveToBuilt(dragVal, false)}
      >
        {bank.map((token, i) => (
          <span
            key={i}
            className="sentence-token"
            draggable={!answered}
            onDragStart={() => setDragVal(token)}
            onClick={() => !answered && moveToBuilt(token, true)}
          >
            {token}
          </span>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={answered || built.length === 0}
        className="sentence-submit"
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

export default SentenceBuilder;