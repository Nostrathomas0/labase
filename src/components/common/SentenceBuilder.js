// src/components/common/SentenceBuilder.js
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
        'sentence-token',
        isDragging ? 'dragging' : '',
        disabled   ? 'used'     : '',
      ].join(' ').trim()}
    >
      {value}
    </span>
  );
};

// ── Token in the builder zone ─────────────────────────────────────
const BuiltToken = ({ id, value, position, answered }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: answered,
    data: { origin: 'built', value, position },
  });
  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'builder-token',
        isDragging ? 'dragging' : '',
      ].join(' ').trim()}
      title="Click to remove"
    >
      {value}
    </span>
  );
};

// ── Droppable builder zone ────────────────────────────────────────
const BuilderZone = ({ children, isEmpty }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'builder-zone' });
  return (
    <div
      ref={setNodeRef}
      className={`builder-zone${isOver ? ' over' : ''}`}
    >
      {isEmpty
        ? <span className="builder-placeholder">Drag words here to build the sentence</span>
        : children
      }
    </div>
  );
};

// ── Droppable bank zone ───────────────────────────────────────────
const BankZone = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'bank-zone' });
  return (
    <div
      ref={setNodeRef}
      className={`sentence-token-bank${isOver ? ' bank-over' : ''}`}
    >
      {children}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────
const SentenceBuilder = ({
  tokens = [],
  correctOrder = [],
  onAnswer,
  questionId,
  progressManager,
}) => {
  // Each token gets a unique id: "word-index"
  const tokenPool = useMemo(() =>
    tokens.map((tok, i) => ({ id: `${tok}-${i}`, value: tok })),
  [tokens]);

  // built = array of { id, value } in order
  const [built, setBuilt]                   = useState([]);
  const [answered, setAnswered]             = useState(false);
  const [feedback, setFeedback]             = useState('');
  const [activeDisplayValue, setActiveDisplayValue] = useState(null);

  const questionHandlerRef = React.useRef(null);
  if (!questionHandlerRef.current) {
    questionHandlerRef.current = new QuestionHandler(progressManager);
  }
  const questionHandler = questionHandlerRef.current;

  useEffect(() => {
    setBuilt([]);
    setAnswered(false);
    setFeedback('');
  }, [tokens, correctOrder]);

  useEffect(() => {
    if (questionId && progressManager) {
      questionHandler.startQuestion(questionId, 'sentenceBuilder');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, progressManager]);

  const builtIds = new Set(built.map(t => t.id));

  const handleDragStart = (event) => {
    setActiveDisplayValue(event.active.data.current?.value || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDisplayValue(null);
    if (!active || !over || answered) return;

    const origin   = active.data.current?.origin;
    const value    = active.data.current?.value;
    const position = active.data.current?.position;
    const overId   = over.id;

    if (origin === 'bank' && overId === 'builder-zone') {
      // bank → builder: append
      setBuilt(prev => [...prev, { id: active.id, value }]);

    } else if (origin === 'built' && overId === 'bank-zone') {
      // builder → bank: remove from built
      setBuilt(prev => prev.filter((_, i) => i !== position));

    } else if (origin === 'built' && overId === 'builder-zone') {
      // reorder within builder — move to end for now
      setBuilt(prev => {
        const next = prev.filter((_, i) => i !== position);
        next.push({ id: active.id, value });
        return next;
      });
    }
  };

  const handleDragCancel = () => setActiveDisplayValue(null);



  const handleSubmit = () => {
    if (answered) return;
    const userSentence = built.map(t => t.value);
    const isCorrect    = userSentence.join(' ') === correctOrder.join(' ');

    if (progressManager) {
      const result = questionHandler.handleAnswer(userSentence, correctOrder, isCorrect);
      setFeedback(result.feedback.message);
      if (onAnswer) onAnswer({
        questionId, isCorrect,
        userAnswer: userSentence,
        correctAnswer: correctOrder,
        progress: result.progress,
      });
    } else {
      setFeedback(isCorrect ? 'Correct! Great job!' : 'Incorrect. Try again!');
      if (onAnswer) onAnswer(isCorrect);
    }

    setAnswered(true);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="sentence-builder">

        <BuilderZone isEmpty={built.length === 0}>
          {built.map((tok, i) => (
            <BuiltToken
              key={tok.id}
              id={`built-${tok.id}-${i}`}
              value={tok.value}
              position={i}
              answered={answered}
            />
          ))}
        </BuilderZone>

        <BankZone>
          {tokenPool.map(tok => (
            <BankToken
              key={tok.id}
              id={tok.id}
              value={tok.value}
              disabled={answered || builtIds.has(tok.id)}
            />
          ))}
        </BankZone>

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

      <DragOverlay dropAnimation={null}>
        {activeDisplayValue ? (
          <span className="sentence-token dragging-overlay">
            {activeDisplayValue}
          </span>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
};

export default SentenceBuilder;