// src/components/common/popBox.js
import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, useDroppable, useDraggable, DragOverlay } from '@dnd-kit/core';
import { QuestionHandler } from '../../utils/ProgressManager';

// ── Token in the bank ────────────────────────────────────────────
const BankToken = ({ id, value, disabled }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
    data: { origin: 'bank', value },
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

// ── Token placed inside a cell (draggable back out) ──────────────
const PlacedToken = ({ cellId, value, answered }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${cellId}`,
    disabled: answered,
    data: { origin: 'cell', cellId, value },
  });
  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'pop-token placed-token',
        isDragging ? 'dragging' : '',
      ].join(' ').trim()}
      title="Drag to move or drop here to remove"
    >
      {value}
    </span>
  );
};

// ── Droppable cell — shows PlacedToken or dashed empty state ─────
const DropCell = ({ id, filled, filledValue, answered, isCorrect }) => {
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
      {filled
        ? <PlacedToken cellId={id} value={filledValue} answered={answered} />
        : '·····'
      }
    </div>
  );
};

// ── Droppable bank zone — drag placed tokens back here ───────────
const BankZone = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'bank-zone' });
  return (
    <div
      ref={setNodeRef}
      className={`pop-token-bank${isOver ? ' bank-over' : ''}`}
    >
      {children}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────
const BoxPopActivity = ({
  columns = [],
  rows = [],
  tokens = [],
  onAnswer,
  questionId = 'popbox-default',
  progressManager,
}) => {
  const [filled, setFilled]           = useState({});
  const [feedback, setFeedback]       = useState('');
  const [answered, setAnswered]       = useState(false);
  const [activeDisplayValue, setActiveDisplayValue] = useState(null); 
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

const handleDragStart = (event) => {
  const val = event.active.data.current?.value;
  setActiveDisplayValue(
    val || event.active.id.replace(/^placed-/, '').replace(/-\d+$/, '')
  );
};

const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!active || answered) return;

  const origin      = active.data.current?.origin;
  const sourceCellId = active.data.current?.cellId;
  const overId      = over?.id;
  const cleanValue  = active.data.current?.value
    || active.id.replace(/^placed-/, '').replace(/-\d+$/, '');

  setFilled(prev => {
    const next = { ...prev };

    if (origin === 'bank') {
      if (overId && overId !== 'bank-zone') {
        next[overId] = cleanValue;
      }

    } else if (origin === 'cell') {
      delete next[sourceCellId];
      if (overId && overId !== 'bank-zone' && overId !== sourceCellId) {
        next[overId] = cleanValue;
      }
    }

    return next;
  });

  setActiveDisplayValue(null);
};

  const handleDragCancel = () => {};

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = () => {
    if (answered) return;

    let correct = 0;
    Object.entries(correctMap).forEach(([cellId, expected]) => {
      const raw = filled[cellId] || '';
      const placedVal = raw.replace(/^placed-/, '').replace(/-\d+$/, '');
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

  
  // Which bank token IDs are currently placed in cells
  const placedTokenValues = new Set(Object.values(filled));

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
                  const raw       = filled[cellId] || '';
                  const placedVal = raw.replace(/-\d+$/, '');
                  const expected  = correctMap[cellId];
                  return (
                    <td key={c} className="griddrop-td">
                      <DropCell
                        id={cellId}
                        filled={!!placedVal}
                        filledValue={placedVal}
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

        <BankZone>
          {tokens.map((tok, i) => (
            <BankToken
              key={`${tok}-${i}`}
              id={`${tok}-${i}`}
              value={tok}
              disabled={
                answered ||
                placedTokenValues.has(`${tok}-${i}`)
              }
            />
          ))}
        </BankZone>

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
              ([id, exp]) => {
                const raw = filled[id] || '';
                const val = raw.replace(/-\d+$/, '');
                return val.toLowerCase() === exp.toLowerCase();
              }
            ) ? 'correct' : 'incorrect'
          }`}>
            {feedback}
          </div>
        )}

      </div>

      <DragOverlay dropAnimation={null}>
        {activeDisplayValue ? (
          <span className="pop-token dragging-overlay">
            {activeDisplayValue}
          </span>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
};

export default BoxPopActivity;