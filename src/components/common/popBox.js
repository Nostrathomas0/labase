// src/components/common/popBox.js
import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { QuestionHandler } from '../../utils/ProgressManager';

const Token = ({ id, value, disabled }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });
  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'pop-token',
        isDragging ? 'dragging' : '',
        disabled   ? 'used'     : '',
      ].join(' ').trim()}
    >
      {value}
    </span>
  );
};

const DropCell = ({ id, filled, answered, isCorrect }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={[
        'pop-drop-cell grid-cell',
        filled   ? 'filled'    : '',
        isOver   ? 'over'      : '',
        answered ? (isCorrect  ? 'correct' : 'incorrect') : '',
      ].join(' ').trim()}
    >
      {filled || '·····'}
    </div>
  );
};

const BoxPopActivity = ({
  columns = [],
  rows = [],
  tokens = [],
  onAnswer,
  questionId = 'popbox-default',
  progressManager,
}) => {
  const [filled, setFilled]     = useState({});
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const questionHandlerRef = React.useRef(null);
    if (!questionHandlerRef.current) {
      questionHandlerRef.current = new QuestionHandler(progressManager);
    }
    const questionHandler = questionHandlerRef.current;

  const correctMap = useMemo(() => {
    const map = {};
    rows.forEach((row, r) => {
      row.blanks.forEach((val, c) => {
        map[`${r}-${c}`] = val;
      });
    });
    return map;
  }, [rows]);

  const totalCells = Object.keys(correctMap).length;

  useEffect(() => {
    setFilled({});
    setFeedback('');
    setAnswered(false);
  }, [questionId]);

  useEffect(() => {
    if (questionId && progressManager) {
      questionHandler.startQuestion(questionId, 'popBox');
    }
  }, [questionId, progressManager, questionHandler]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || answered) return;
    setFilled(prev => ({ ...prev, [over.id]: active.id }));
  };

  const handleSubmit = () => {
    if (answered) return;

    let correct = 0;
    Object.entries(correctMap).forEach(([cellId, expected]) => {
      const placedVal = (filled[cellId] || '').replace(/-\d+$/, '');
      if (placedVal.toLowerCase() === expected.toLowerCase()) correct++;
    });

    const score     = Math.round((correct / totalCells) * 100);
    const isCorrect = correct === totalCells;

    if (progressManager) {
      const result = questionHandler.handleAnswer(filled, correctMap, isCorrect);
      setFeedback(`${correct}/${totalCells} correct (${score}%)`);
      if (onAnswer) onAnswer({
        questionId, isCorrect, score,
        userAnswer: filled, correctAnswer: correctMap,
        progress: result.progress,
      });
    } else {
      setFeedback(`${correct}/${totalCells} correct (${score}%)`);
      if (onAnswer) onAnswer(isCorrect);
    }

    setAnswered(true);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="griddrop-container">

        <table className="griddrop-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="griddrop-th">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                <td className="griddrop-row-header">{row.header}</td>
                {row.blanks.map((_, c) => {
                  const cellId    = `${r}-${c}`;
                  const placed    = filled[cellId] || '';
                  const placedVal = placed.replace(/-\d+$/, '');
                  const expected  = correctMap[cellId];
                  return (
                    <td key={c} className="griddrop-td">
                      <DropCell
                        id={cellId}
                        filled={placedVal || null}
                        answered={answered}
                        isCorrect={
                          placedVal.toLowerCase() === expected.toLowerCase()
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pop-token-bank">
          {tokens.map((tok, i) => (
            <Token
              key={`${tok}-${i}`}
              id={`${tok}-${i}`}
              value={tok}
              disabled={
                answered ||
                Object.values(filled).includes(`${tok}-${i}`)
              }
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={answered || Object.keys(filled).length < totalCells}
          className="pop-submit"
        >
          Check — {Object.keys(filled).length}/{totalCells} filled
        </button>

        {feedback && (
          <div className={`feedback ${
            answered && Object.entries(correctMap).every(
              ([id, exp]) =>
                (filled[id] || '').replace(/-\d+$/, '').toLowerCase() === exp.toLowerCase()
            ) ? 'correct' : 'incorrect'
          }`}>
            {feedback}
          </div>
        )}

      </div>
    </DndContext>
  );
};

export default BoxPopActivity;