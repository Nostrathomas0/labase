// GrammarTopic
import React from 'react';
import '../App.css';
import ImageDisplay from './common/ImageDisplay';
import MultipleChoice from './common/MultipleChoice';
import GapFill from './common/GapFill';
import ClickActivity from './common/ClickActivity';
import WordBankActivity from './common/WordBankActivity';
import Instructions from './common/Instructions'

function GrammarTopic({ contentData }) {
  if (!contentData || contentData.length === 0) {
    return <div>No content available.</div>;
  }
  const handleAnswer = (isCorrect) => {
    console.log(isCorrect ? 'Correct!' : 'Try again!');
  };
  
  return (
    <div className="Grammar">
  {contentData.map((question, questionIndex) => {
    // Log the question and its index before the switch statement
    console.log(`Processing Question ${questionIndex}:`, question);

    switch (question.type) {
      case 'imageDisplay':
        return (
          <ImageDisplay 
            key={`image-${questionIndex}`} 
            imagePath={question.imagePath} 
            altText={question.altText} 
          />
        );
    
      case 'multipleChoice':
        return (
          <MultipleChoice 
            key={`mc-${questionIndex}`} 
            question={question.question} 
            options={question.options} 
            correctAnswer={question.correctAnswer} 
            onAnswer={handleAnswer} 
          />
        );
    
      case 'gapFill':
        return (
          <GapFill 
            key={`gap-${questionIndex}`} 
            template={question.template} 
            correctAnswer={question.correctAnswer} 
            onAnswer={handleAnswer} 
          />
        );
    
      case 'click':
        return (
          <div key={`click-${questionIndex}`}>
            <Instructions instructions={question.instructions} />
            <ClickActivity 
              words={question.words} 
              keyWords={question.keyWords} 
              onAnswer={handleAnswer} 
            />
          </div>
        );
    
      case 'wordBank':
        return (
          <WordBankActivity 
            key={`wordbank-${questionIndex}`} 
            paragraph={question.paragraph} 
            wordBank={question.wordBank} 
            correctAnswers={question.correctAnswers} 
            onAnswer={handleAnswer} 
          />
        );
    
      default:
        return null;
    }
    
  })}
</div>

  );
} 


export default GrammarTopic;