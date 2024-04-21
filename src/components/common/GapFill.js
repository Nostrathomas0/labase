import React, { useState } from 'react';

function GapFill({ template, correctAnswers = [], onAnswer }) {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Input:", userInput.trim().toLowerCase()); // Log user input
    console.log("Correct Answers:", correctAnswers); // Log correct answers

    const isCorrect = correctAnswers.some(answer => 
      answer.toLowerCase() === userInput.trim().toLowerCase()
    );

    console.log("Is Correct:", isCorrect); // Log the result of the check

    if (isCorrect) {
      setFeedback('Correct! Great job!');
    } else {
      setFeedback('Incorrect. Try again!');
    }

    onAnswer(isCorrect);
    setUserInput(''); // Clear the input after submission
  };

  // Handle templates that have the placeholder "_____"
  const parts = template.split("_____");

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          {parts[0]}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer"
          />
          {parts[1]}
        </p>
        <button type="submit">Submit</button>
      </form>
      {/* Display feedback */}
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default GapFill;
