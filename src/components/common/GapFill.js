// src/components/GapFill.js
import React, { useState } from 'react';

function GapFill({ template, correctAnswer, onAnswer }) {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    const isCorrect = correctAnswer.map(answer => answer.toLowerCase()).includes(userInput.trim().toLowerCase());
    onAnswer(isCorrect); // Invoke the callback with the result
    setUserInput(''); // Optional: Clear the input after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>{template.replace("_____", "<input type='text' value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder='Type your answer' />")}</p>
      <button type="submit">Submit</button>
    </form>
  );
}
export default GapFill;
