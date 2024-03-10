// src/components/GapFill.js
import React, { useState } from 'react';

function GapFill({ template, correctAnswer, onAnswer }) {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    onAnswer(userInput.trim().toLowerCase() === correctAnswer.toLowerCase()); // Invoke the callback with the result
    setUserInput(''); // Optional: Clear the input after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>{template.replace("_____", "_____")}</p> {/* Display the template */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)} // Update state on input change
        placeholder="Type your answer here"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default GapFill;
