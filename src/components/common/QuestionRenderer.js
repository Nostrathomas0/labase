import React from 'react';
import MultipleChoice from './MultipleChoice';
import ClickActivity from './ClickActivity';
import GapFill from './GapFill';
import WordBankActivity from './WordBankActivity';
import ImageDisplay from './ImageDisplay';
import Instructions from './Instructions';

const QuestionRenderer = ({ 
  questionData, 
  questionId, 
  progressManager, 
  onAnswer 
}) => {
  // Handle case where no question data is provided
  if (!questionData) {
    return (
      <div className="no-question-message">
        <p>Loading question...</p>
      </div>
    );
  }

  const { type, ...props } = questionData;

  // Common props for all question components
  const commonProps = {
    questionId,
    progressManager,
    onAnswer,
    ...props
  };

  switch (type) {
    case 'multipleChoice':
      return (
        <MultipleChoice
          question={props.question}
          options={props.options}
          correctAnswer={props.correctAnswer}
          {...commonProps}
        />
      );

    case 'clickActivity':
      return (
        <ClickActivity
          instructions={props.instructions}
          words={props.words}
          keyWords={props.keyWords}
          layout={props.layout}
          {...commonProps}
        />
      );

    case 'gapFill':
      return (
        <GapFill
          template={props.template}
          correctAnswers={props.correctAnswers}
          {...commonProps}
        />
      );

    case 'wordBank':
      return (
        <WordBankActivity
          paragraph={props.paragraph}
          wordBank={props.wordBank}
          correctAnswers={props.correctAnswers}
          {...commonProps}
        />
      );

    case 'image':
      return (
        <div className="image-question">
          <ImageDisplay
            imagePath={props.imagePath}
            altText={props.altText}
          />
          {props.caption && (
            <p className="image-caption">{props.caption}</p>
          )}
        </div>
      );

    case 'instructions':
      return (
        <Instructions
          instructions={props.instructions}
        />
      );

    default:
      console.warn(`Unknown question type: ${type}`);
      return (
        <div className="unknown-question-type">
          <p>Unknown question type: {type}</p>
          <pre>{JSON.stringify(questionData, null, 2)}</pre>
        </div>
      );
  }
};

export default QuestionRenderer;