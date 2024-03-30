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
      {contentData.questions.map((item, index) => { // Directly iterate over questions
        switch (item.type) {
          case 'imageDisplay':
            console.log(`Rendering image with path: ${item.imagePath}`);
            return <ImageDisplay key={`image-${index}`} imagePath={item.imagePath} altText={item.altText} />;
          case 'multipleChoice':
            return (
              <MultipleChoice
                key={`mc-${index}`} // Updated key
                question={item.question}
                options={item.options}
                correctAnswer={item.correctAnswer}
                onAnswer={handleAnswer}
              />
            );
          case 'gapFill':
            return (
              <GapFill
                key={`gap-${index}`} // Updated key
                template={item.template}
                correctAnswer={item.correctAnswer}
                onAnswer={handleAnswer}
              />
            );
          case 'click': // Adjusted to your new question type
            return (
              <ClickActivity
                key={`click-${index}`} // Updated key
                instructions={item.instructions}
                words={item.words}
                keyWords={item.keyWords}
              />
            );
          case 'wordBank':
            return (
              <WordBankActivity
                key={`wordbank-${index}`} // Updated key
                paragraph={item.paragraph}
                wordBank={item.wordBank}
                correctAnswers={item.correctAnswers}
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