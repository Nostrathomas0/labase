import React from 'react';
import MultipleChoice from './MultipleChoice';
import ClickActivity from './ClickActivity';
import GapFill from './GapFill';
import WordBankActivity from './WordBankActivity';
import ImageDisplay from './ImageDisplay';
import Instructions from './Instructions';
// NEW
import BoxPopActivity from './popBox';
import SentenceBuilder from './SentenceBuilder';
import MatchingPairs from './MatchingPairs';

const QuestionRenderer = ({ 
  questionData, 
  questionId, 
  progressManager, 
  onAnswer 
}) => {
  if (!questionData) {
    return (
      <div className="no-question-message">
        <p>Loading question...</p>
      </div>
    );
  }

  const { type, ...props } = questionData;

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

    case 'click':
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

    // FIXED - was using wrong variable names
    case 'popBox':
      return (
        <BoxPopActivity
          columns={props.columns}
          rows={props.rows}
          tokens={props.tokens}
          {...commonProps}
        />
      );

    // NEW
    case 'sentenceBuilder':
      return (
        <SentenceBuilder
          tokens={props.tokens}
          correctOrder={props.correctOrder}
          {...commonProps}
        />
      );

    // NEW
    case 'matchingPairs':
      return (
        <MatchingPairs
          pairs={props.pairs}
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