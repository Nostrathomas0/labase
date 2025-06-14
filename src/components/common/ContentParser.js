// ContentParser.js - Universal content parser for ALL data packet types
import React from 'react';
import ImageDisplay from './common/ImageDisplay';
import Instructions from './common/Instructions';

// Define which content types go where
const LEFT_PANEL_TYPES = [
  'image', 'instructions', 'text', 'heading', 'paragraph', 'title', 
  'subtitle', 'description', 'explanation', 'example', 'note',
  'reading', 'passage', 'story', 'dialogue', 'conversation'
];

const RIGHT_PANEL_TYPES = [
  'multipleChoice', 'clickActivity', 'gapFill', 'wordBank', 'wordBankActivity',
  'question', 'exercise', 'activity', 'quiz', 'test', 'assessment',
  'truefalse', 'matching', 'ordering', 'dragdrop', 'fillblanks',
  // Add your specific types
  'click', 'wordBank'
];

export const parseContent = (data) => {
  // Handle different data structures
  let contentArray = [];
  
  if (!data) {
    return { leftContent: null, exerciseData: null };
  }

  // Extract content array from various possible structures
  if (Array.isArray(data)) {
    contentArray = data;
  } else if (data.content && Array.isArray(data.content)) {
    contentArray = data.content;
  } else if (data.items && Array.isArray(data.items)) {
    contentArray = data.items;
  } else if (data.questions && Array.isArray(data.questions)) {
    // For exam-style data where everything might be questions
    contentArray = data.questions;
  } else if (data.sections && Array.isArray(data.sections)) {
    // Flatten sections if needed
    contentArray = data.sections.flatMap(section => 
      section.content || section.items || section.questions || [section]
    );
  } else {
    // Single item, wrap in array
    contentArray = [data];
  }

  const leftItems = [];
  const exerciseItems = [];

  // Process each content item
  contentArray.forEach((item, index) => {
    if (!item || !item.type) {
      // Try to infer type from properties
      if (item.imagePath || item.image) {
        item.type = 'image';
      } else if (item.instructions) {
        item.type = 'instructions';
      } else if (item.question && item.options) {
        item.type = 'multipleChoice';
      } else if (item.words && item.keyWords) {
        item.type = 'clickActivity';
      } else if (item.template && item.correctAnswers) {
        item.type = 'gapFill';
      } else if (item.template && item.correctAnswer) {
        item.type = 'gapFill';
      } else if (item.wordBank && item.correctAnswers) {
        item.type = 'wordBank';
      } else if (item.text) {
        item.type = 'text';
      } else {
        console.warn('Could not determine type for item:', item);
        return;
      }
    }

    const itemType = item.type.toLowerCase();

    // Determine which panel this goes to
    if (LEFT_PANEL_TYPES.includes(itemType)) {
      leftItems.push(renderLeftPanelItem(item, index));
    } else if (RIGHT_PANEL_TYPES.includes(itemType)) {
      exerciseItems.push({
        id: `exercise-${index}`,
        ...item
      });
    } else {
      // Unknown type - make an educated guess
      if (item.question || item.options || item.correctAnswer || item.correctAnswers) {
        // Looks like an exercise
        exerciseItems.push({
          id: `exercise-${index}`,
          type: 'unknown-exercise',
          ...item
        });
      } else {
        // Looks like content
        leftItems.push(renderLeftPanelItem(item, index));
      }
    }
  });

  const leftContent = leftItems.length > 0 ? (
    <div className="lesson-content">
      {leftItems}
    </div>
  ) : null;

  const exerciseData = exerciseItems.length > 0 ? {
    questions: exerciseItems,
    lessonId: data.id || data.lessonId || 'unknown',
    title: data.title || data.name || 'Lesson',
    type: data.type || 'lesson'
  } : null;

  return { leftContent, exerciseData };
};

// Render function for left panel items
const renderLeftPanelItem = (item, index) => {
  const itemType = item.type?.toLowerCase();

  switch (itemType) {
    case 'image':
      return (
        <div key={`image-${index}`} className="content-image">
          <ImageDisplay
            imagePath={item.imagePath || item.image || item.src}
            altText={item.altText || item.alt || 'Lesson image'}
          />
          {item.caption && (
            <p className="image-caption">{item.caption}</p>
          )}
        </div>
      );

    case 'instructions':
      return (
        <div key={`instructions-${index}`} className="content-instructions">
          <Instructions instructions={item.instructions || []} />
        </div>
      );

    case 'text':
    case 'paragraph':
      return (
        <div key={`text-${index}`} className="content-text">
          <p>{item.text || item.content || item.paragraph}</p>
        </div>
      );

    case 'heading':
    case 'title':
      return (
        <div key={`heading-${index}`} className="content-heading">
          <h2>{item.text || item.title || item.heading}</h2>
        </div>
      );

    case 'subtitle':
      return (
        <div key={`subtitle-${index}`} className="content-subtitle">
          <h3>{item.text || item.subtitle}</h3>
        </div>
      );

    case 'reading':
    case 'passage':
      return (
        <div key={`reading-${index}`} className="content-reading">
          <div className="reading-title">
            {item.title && <h3>{item.title}</h3>}
          </div>
          <div className="reading-text">
            {Array.isArray(item.paragraphs) 
              ? item.paragraphs.map((p, i) => <p key={i}>{p}</p>)
              : <p>{item.text || item.content}</p>
            }
          </div>
        </div>
      );

    default:
      // Generic fallback
      return (
        <div key={`content-${index}`} className={`content-${itemType || 'unknown'}`}>
          {item.text || item.content || JSON.stringify(item)}
        </div>
      );
  }
};

// Helper component for rendering lesson content
export const LessonRenderer = ({ 
  lessonData, 
  progressManager, 
  onQuestionComplete, 
  onLessonComplete 
}) => {
  const { leftContent, exerciseData } = parseContent(lessonData);

  return {
    leftContent,
    exerciseData,
    // Pass these to MainLayout
    layoutProps: {
      lessonData: exerciseData,
      progressManager,
      onQuestionComplete,
      onLessonComplete
    }
  };
};