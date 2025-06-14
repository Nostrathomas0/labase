// ContentParser.js - Universal content parser for ALL data packet types
import React from 'react';
import ImageDisplay from './ImageDisplay';
import Instructions from './Instructions';

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
  console.log('=== CONTENT PARSER START ===');
  console.log('Raw data received:', data);
  
  // Handle different data structures
  let contentArray = [];
  
  if (!data) {
    console.log('No data provided');
    return { leftContent: null, exerciseData: null };
  }

  // Extract content array from various possible structures
  if (Array.isArray(data)) {
    contentArray = data;
    console.log('Data is array, using directly');
  } else if (data.content && Array.isArray(data.content)) {
    contentArray = data.content;
    console.log('Found content array:', contentArray.length, 'items');
  } else if (data.items && Array.isArray(data.items)) {
    contentArray = data.items;
    console.log('Found items array:', contentArray.length, 'items');
  } else if (data.questions && Array.isArray(data.questions)) {
    // For exam-style data where everything might be questions
    contentArray = data.questions;
    console.log('Found questions array:', contentArray.length, 'items');
  } else if (data.sections && Array.isArray(data.sections)) {
    // Flatten sections if needed
    contentArray = data.sections.flatMap(section => 
      section.content || section.items || section.questions || [section]
    );
    console.log('Found sections, flattened to:', contentArray.length, 'items');
  } else {
    // Single item, wrap in array
    contentArray = [data];
    console.log('Single item, wrapped in array');
  }

  console.log('Content array to process:', contentArray);

  const leftItems = [];
  const exerciseItems = [];

  // Process each content item
  contentArray.forEach((item, index) => {
    console.log(`Processing item ${index}:`, item);
    
    if (!item || typeof item !== 'object') {
      console.log(`Skipping invalid item ${index}:`, item);
      return;
    }

    let itemType = item.type;
    
    if (!itemType) {
      console.log(`No type found for item ${index}, attempting to infer...`);
      // Try to infer type from properties
      if (item.imagePath || item.image) {
        itemType = 'imageDisplay';
        console.log(`Inferred type: imageDisplay`);
      } else if (item.instructions) {
        itemType = 'instructions';
        console.log(`Inferred type: instructions`);
      } else if (item.question && item.options) {
        itemType = 'multipleChoice';
        console.log(`Inferred type: multipleChoice`);
      } else if (item.words && item.keyWords) {
        itemType = 'clickActivity';
        console.log(`Inferred type: clickActivity`);
      } else if (item.template && (item.correctAnswers || item.correctAnswer)) {
        itemType = 'gapFill';
        console.log(`Inferred type: gapFill`);
      } else if (item.wordBank && item.correctAnswers) {
        itemType = 'wordBank';
        console.log(`Inferred type: wordBank`);
      } else if (item.text) {
        itemType = 'text';
        console.log(`Inferred type: text`);
      } else {
        console.warn('Could not determine type for item:', item);
        return;
      }
    }

    const normalizedType = itemType.toLowerCase();
    console.log(`Item ${index} type: ${itemType} -> ${normalizedType}`);

    // Determine which panel this goes to
    if (LEFT_PANEL_TYPES.includes(normalizedType)) {
      console.log(`Item ${index} -> LEFT PANEL`);
      leftItems.push(renderLeftPanelItem({...item, type: itemType}, index));
    } else if (RIGHT_PANEL_TYPES.includes(normalizedType)) {
      console.log(`Item ${index} -> RIGHT PANEL`);
      exerciseItems.push({
        id: `exercise-${index}`,
        ...item,
        type: itemType
      });
    } else {
      console.log(`Item ${index} -> UNKNOWN TYPE, making educated guess...`);
      // Unknown type - make an educated guess
      if (item.question || item.options || item.correctAnswer || item.correctAnswers) {
        console.log(`Item ${index} -> Looks like exercise, adding to RIGHT PANEL`);
        exerciseItems.push({
          id: `exercise-${index}`,
          type: 'unknown-exercise',
          ...item
        });
      } else {
        console.log(`Item ${index} -> Looks like content, adding to LEFT PANEL`);
        leftItems.push(renderLeftPanelItem(item, index));
      }
    }
  });

  console.log(`Final results: ${leftItems.length} left items, ${exerciseItems.length} exercise items`);

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

  console.log('Left content created:', !!leftContent);
  console.log('Exercise data created:', !!exerciseData);
  console.log('=== CONTENT PARSER END ===');

  return { leftContent, exerciseData };
};

// Render function for left panel items
const renderLeftPanelItem = (item, index) => {
  const itemType = item.type?.toLowerCase();

  try {
    switch (itemType) {
      case 'imagedisplay':
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
                ? item.paragraphs.map((p, i) => <p key={`p-${i}`}>{p}</p>)
                : <p>{item.text || item.content}</p>
              }
            </div>
          </div>
        );

      default:
        // Generic fallback - be more careful with content
        const content = item.text || item.content;
        if (typeof content === 'string') {
          return (
            <div key={`content-${index}`} className={`content-${itemType || 'unknown'}`}>
              <p>{content}</p>
            </div>
          );
        } else {
          console.warn('Could not render item:', item);
          return null;
        }
    }
  } catch (error) {
    console.error('Error rendering left panel item:', error, item);
    return (
      <div key={`error-${index}`} className="content-error">
        <p>Error loading content item</p>
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