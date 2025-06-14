import React, { useState, useEffect } from 'react';
import { QuestionHandler } from '../../utils/ProgressManager';

function GapFill({ 
  template, 
  correctAnswers = [], 
  onAnswer,
  questionId,
  progressManager 
}) {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

  useEffect(() => {
    setUserInput('');
    setFeedback('');
    setAnswered(false);
  }, [template, correctAnswers]);

  useEffect(() => {
    // Start tracking this question
    if (questionId && progressManager && questionHandler) {
      questionHandler.startQuestion(questionId, 'gapFill');
    }
  }, [questionId, progressManager, questionHandler]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answered) return;

    console.log("User Input:", userInput.trim().toLowerCase());
    console.log("Correct Answers:", correctAnswers);

    const isCorrect = correctAnswers.some(answer => 
      answer.toLowerCase() === userInput.trim().toLowerCase()
    );

    console.log("Is Correct:", isCorrect);

    if (progressManager) {
      // New progress tracking system
      const result = questionHandler.handleAnswer(userInput.trim(), correctAnswers, isCorrect);
      setFeedback(result.feedback.message);
      
      if (onAnswer) {
        onAnswer({
          questionId,
          isCorrect,
          userAnswer: userInput.trim(),
          correctAnswer: correctAnswers,
          progress: result.progress
        });
      }
    } else {
      // Backward compatibility - old callback system
      if (isCorrect) {
        setFeedback('Correct! Great job!');
      } else {
        setFeedback('Incorrect. Try again!');
      }
      
      if (onAnswer) {
        onAnswer(isCorrect);
      }
    }

    setAnswered(true);
    // Don't clear input immediately - let user see their answer
  };

  // Handle templates that have the placeholder "_____"
  const parts = template.split("_____");

  return (
    <div className="gap-fill-container">
      <form onSubmit={handleSubmit}>
        <p className="gap-fill-question">
          {parts[0]}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer"
            disabled={answered}
            className={answered ? (feedback.includes('Correct') ? 'correct' : 'incorrect') : ''}
          />
          {parts[1]}
        </p>
        <button 
          type="submit" 
          disabled={answered || !userInput.trim()}
          className="gap-fill-submit"
        >
          Submit
        </button>
      </form>
      {feedback && (
        <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default GapFill;