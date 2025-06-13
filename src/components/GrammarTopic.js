import React from 'react';
import '../App.css';
import ImageDisplay from './common/ImageDisplay';
import MultipleChoice from './common/MultipleChoice';
import GapFill from './common/GapFill';
import ClickActivity from './common/ClickActivity';
import WordBankActivity from './common/WordBankActivity';

function GrammarTopic({ 
  contentData, 
  progressManager, 
  level, 
  topic, 
  page 
}) {
  console.log('Rendering GrammarTopic with contentData:', contentData);

  if (!contentData || contentData.length === 0) {
    return <div>No content available.</div>;
  }

  const handleAnswer = (answerData) => {
    if (answerData.progress) {
      // New progress system
      console.log('Progress update:', answerData.progress);
      console.log('Question answered:', answerData);
    } else {
      // Old system (backward compatibility)
      console.log(answerData ? 'Correct!' : 'Try again!');
    }
  };

  return (
    <div className="Grammar">
      {contentData.map((question, questionIndex) => {
        console.log(`Processing Question ${questionIndex}:`, question);

        const layout = question.layout || 'horizontal';
        
        // Generate unique question ID for progress tracking
        const questionId = progressManager ? 
          `${level}-${topic}-p${page}-q${questionIndex + 1}` : 
          null;

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
                key={`mc-${questionIndex}-${question.question}`}
                question={question.question} 
                options={question.options} 
                correctAnswer={question.correctAnswer} 
                questionId={questionId}
                progressManager={progressManager}
                onAnswer={handleAnswer} 
              />
            );

          case 'gapFill':
            return (
              <GapFill 
                key={`gap-${questionIndex}-${question.template}`}
                template={question.template} 
                correctAnswers={question.correctAnswers} 
                questionId={questionId}
                progressManager={progressManager}
                onAnswer={handleAnswer} 
              />
            );

          case 'click':
            return (
              <div key={`click-${questionIndex}`}>
                <ClickActivity 
                  key={`click-${questionIndex}-${question.instructions[0]?.text}`}
                  instructions={question.instructions || []}
                  words={question.words || []} 
                  keyWords={question.keyWords || []} 
                  questionId={questionId}
                  progressManager={progressManager}
                  onAnswer={handleAnswer} 
                  layout={layout} 
                />
              </div>
            );

          case 'wordBank':
            return (
              <WordBankActivity 
                key={`wordbank-${questionIndex}-${question.paragraph}`}
                paragraph={question.paragraph} 
                wordBank={question.wordBank} 
                correctAnswers={question.correctAnswers} 
                questionId={questionId}
                progressManager={progressManager}
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