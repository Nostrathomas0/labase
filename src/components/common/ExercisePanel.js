import React, { useState, useEffect } from 'react';
import QuestionRenderer from './QuestionRenderer.js';

const ExercisePanel = ({ 
  lessonData, 
  currentQuestionIndex = 0, 
  progressManager, 
  onQuestionComplete,
  onLessonComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentQuestionIndex);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  // Reset when lesson changes
  useEffect(() => {
    setCurrentIndex(0);
    setCompletedQuestions(new Set());
  }, [lessonData]);

  // Handle when there's no lesson data
  if (!lessonData || !lessonData.questions || lessonData.questions.length === 0) {
    return (
      <div className="exercise-panel-empty">
        <h3>Interactive Exercises</h3>
        <p>No exercises available for this lesson.</p>
      </div>
    );
  }

  const questions = lessonData.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswer = (answerData) => {
    // Mark this question as completed
    const newCompleted = new Set(completedQuestions);
    newCompleted.add(currentIndex);
    setCompletedQuestions(newCompleted);

    // Call the parent callback
    if (onQuestionComplete) {
      onQuestionComplete({
        questionIndex: currentIndex,
        ...answerData
      });
    }

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Lesson completed
        if (onLessonComplete) {
          onLessonComplete({
            totalQuestions,
            completedQuestions: newCompleted.size + 1
          });
        }
      }
    }, 1500); // 1.5 second delay to show feedback
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="exercise-panel">
      {/* Progress indicator */}
      <div className="exercise-progress">
        <div className="progress-info">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${((currentIndex + 1) / totalQuestions) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Navigation dots */}
      <div className="question-navigation">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`nav-dot ${index === currentIndex ? 'active' : ''} ${
              completedQuestions.has(index) ? 'completed' : ''
            }`}
            title={`Question ${index + 1}`}
          />
        ))}
      </div>

      {/* Current question */}
      <div className="question-container">
        <QuestionRenderer
          questionData={currentQuestion}
          questionId={`q_${currentIndex}`}
          progressManager={progressManager}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Navigation buttons */}
      <div className="exercise-navigation">
        <button
          onClick={() => goToQuestion(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="nav-button prev"
        >
          Previous
        </button>
        
        <button
          onClick={() => goToQuestion(currentIndex + 1)}
          disabled={currentIndex === totalQuestions - 1}
          className="nav-button next"
        >
          Next
        </button>
      </div>

      {/* Lesson completion message */}
      {completedQuestions.size === totalQuestions && (
        <div className="lesson-complete">
          <h3>Lesson Complete!</h3>
          <p>Great job! You've completed all {totalQuestions} questions.</p>
        </div>
      )}
    </div>
  );
};

export default ExercisePanel;