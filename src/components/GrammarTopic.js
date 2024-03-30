// GrammarTopic
import React from 'react';
import '../App.css';
import ImageDisplay from './ImageDisplay';
import MultipleChoice from './MultipleChoice';
import GapFill from './GapFill';
import ClickActivity from './ClickActivity';
import WordBankActivity from './WordBankActivity';
import Instructions from './Instructions'

function GrammarTopic({ contentData }) {
  console.log(contentData);

  // Check if contentData is defined and has questions
  if (!contentData || !contentData.questions) {
    console.error('Invalid contentData provided to GrammarTopic');
    return null; // Render nothing or a placeholder indicating the data is missing
  }

  const { topic, questions } = contentData;

  const handleAnswer = (isCorrect) => {
    alert(isCorrect ? 'Correct!' : 'Try again!');
  };

  return (
    <div className="Grammar">
      <h2>{topic}</h2>
      {questions.map((question, questionIndex) => {
        switch (question.type) {
          case 'imageDisplay':
            console.log(`Rendering image with path: ${question.imagePath}`);
            return <ImageDisplay key={`image-${questionIndex}`} imagePath={question.imagePath} altText={question.altText} />;
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
                  instructions={question.instructions}
                  words={question.words}
                  keyWords={question.keyWords}
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