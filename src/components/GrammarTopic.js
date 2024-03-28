// GrammarTopic
import React from 'react';
import '../App.css';
import ImageDisplay from './ImageDisplay';
import MultipleChoice from './MultipleChoice';
import GapFill from './GapFill';
import ClickActivity from './ClickActivity';
import WordBankActivity from './WordBankActivity';

// Accept contentData as a prop
function GrammarTopic({ contentData }) {
  console.log(contentData);
  const handleAnswer = (isCorrect) => {
    alert(isCorrect ? 'Correct!' : 'Try again!');
  };

 
  return (
    <div className="Grammar">
      {contentData.pages.map((page, pageIndex) => (
        page.questions.map((item, index) => {
          switch (item.type) {
            case 'imageDisplay':
              return <ImageDisplay key={`image-${pageIndex}-${index}`} imagePath={item.imagePath} altText={item.altText} />;
            case 'multipleChoice':
              return (
                <MultipleChoice
                  key={`mc-${pageIndex}-${index}`}
                  question={item.question}
                  options={item.options}
                  correctAnswer={item.correctAnswer}
                  onAnswer={handleAnswer}
                />
              );
            case 'gapFill':
              return (
                <GapFill
                  key={`gap-${pageIndex}-${index}`}
                  template={item.template}
                  correctAnswer={item.correctAnswer}
                  onAnswer={handleAnswer}
                />
              );
              case 'click': // Adjusted to your new question type
              return (
                <ClickActivity
                  key={`click-${pageIndex}-${index}`}
                  instructions={item.instructions}
                  words={item.words}
                  keyWords={item.keyWords}
                />
              );
            case 'wordBank':
              return (
                <WordBankActivity
                  key={`wordbank-${pageIndex}-${index}`}
                  paragraph={item.paragraph}
                  wordBank={item.wordBank}
                  correctAnswers={item.correctAnswers}
                />
              );
            default:
              return null;
          }
        })
      ))}
    </div>
  );
}

export default GrammarTopic;