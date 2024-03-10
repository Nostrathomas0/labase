import React from 'react';
import './App.css';
import ImageDisplay from './components/ImageDisplay';
import MultipleChoice from './components/MultipleChoice';
import GapFill from './components/GapFill';
import Image1 from './assets/images/there/1.png'
import Image2 from './assets/images/there/2.png'


function App() {
  const handleAnswer = (isCorrect) => {
    alert(isCorrect ? 'Correct!' : 'Try again!');
  };

  return (
    <div className="App">
      <ImageDisplay imagePath={Image1} altText="There is/are" />
      <ImageDisplay imagePath={Image2} altText="Descriptive Alt Text for Image 2" />
      
      <MultipleChoice 
        question="There are ______ apples" 
        options={['a', 'an', 'some', 'a lot']} 
        correctAnswer="some"
        onAnswer={handleAnswer}
      />
      <GapFill 
        template="_____ the picnic." 
        correctAnswer="at"
        onAnswer={handleAnswer}
      />
    </div>
  );
}

export default App; 
