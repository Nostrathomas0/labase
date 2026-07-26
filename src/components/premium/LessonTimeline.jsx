// src/components/premium/LessonTimeline.jsx
// Replaces PageTurner for premium content.
// Renders lesson pages as points on a horizontal/vertical timeline.
// Each node shows completion state and content type badges.

import React, { useState } from 'react';

// Content type badge colors — extend as new types are added
const TYPE_COLORS = {
  click:         '#4A90D9',
  multipleChoice:'#7B68EE',
  gapFill:       '#3CB371',
  wordBank:      '#FF8C00',
  boxPop:        '#E91E8C',
  sentenceBuilder:'#00BCD4',
  matchingPairs: '#9C27B0',
  imageDisplay:  '#90A4AE',
  instructions:  '#B0BEC5',
};

const getPageTypes = (page) => {
  const types = page.questions
    .map(q => q.type)
    .filter(t => t !== 'imageDisplay' && t !== 'instructions');
  return [...new Set(types)];
};

const TypeBadge = ({ type }) => (
  <span style={{
    background: TYPE_COLORS[type] || '#999',
    color: '#fff',
    fontSize: '0.65rem',
    padding: '2px 6px',
    borderRadius: '10px',
    marginRight: '4px',
    whiteSpace: 'nowrap'
  }}>
    {type}
  </span>
);

const LessonTimeline = ({
  lessonData,
  currentPage,
  onPageChange,
  completedPages = []
}) => {
  const [hovered, setHovered] = useState(null);
  const pages = lessonData.pages || [];
  const total = pages.length;

  return (
    <div className="lesson-timeline">

      {/* Topic header */}
      <div className="timeline-header">
        <span className="timeline-topic">{lessonData.topic}</span>
        <span className="timeline-progress">
          {completedPages.length}/{total} complete
        </span>
      </div>

      {/* Timeline track */}
      <div className="timeline-track">

        {/* Progress fill bar */}
        <div
          className="timeline-fill"
          style={{ width: `${(completedPages.length / total) * 100}%` }}
        />

        {/* Page nodes */}
        {pages.map((page, index) => {
          const isCompleted = completedPages.includes(index);
          const isCurrent   = currentPage === index;
          const isLocked    = index > completedPages.length; // must complete in order
          const types       = getPageTypes(page);

          return (
            <div
              key={index}
              className="timeline-node-wrapper"
              style={{ left: `${(index / (total - 1)) * 100}%` }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* The node circle */}
              <button
                className={[
                  'timeline-node',
                  isCurrent   ? 'current'   : '',
                  isCompleted ? 'completed' : '',
                  isLocked    ? 'locked'    : '',
                ].join(' ')}
                onClick={() => !isLocked && onPageChange(index)}
                disabled={isLocked}
                aria-label={`Page ${index + 1}${isCompleted ? ' completed' : ''}`}
              >
                {isCompleted ? '✓' : isLocked ? '🔒' : index + 1}
              </button>

              {/* Tooltip on hover */}
              {hovered === index && (
                <div className="timeline-tooltip">
                  <strong>Page {index + 1}</strong>
                  <div className="tooltip-types">
                    {types.map(t => <TypeBadge key={t} type={t} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current page label */}
      <div className="timeline-label">
        Page {currentPage + 1} of {total}
        <span className="timeline-types">
          {getPageTypes(pages[currentPage]).map(t =>
            <TypeBadge key={t} type={t} />
          )}
        </span>
      </div>

    </div>
  );
};

export default LessonTimeline;
