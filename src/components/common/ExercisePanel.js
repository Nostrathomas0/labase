import React, { useState, useEffect } from 'react';
import QuestionRenderer from './QuestionRenderer.js';
import { QuestionHandler } from '../../utils/ProgressManager.js';

const ExercisePanel = ({ 
  lessonData, 
  currentQuestionIndex = 0, 
  progressManager, 
  onQuestionComplete,
  onLessonComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentQuestionIndex);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [questionKey, setQuestionKey] = useState(0); // Force re-mount
  const [questionHandler] = useState(() => new QuestionHandler(progressManager));

  // Reset when lesson changes
  useEffect(() => {
    setCurrentIndex(0);
    setCompletedQuestions(new Set());
    setQuestionKey(0);
  }, [lessonData]);

  // Initialize question when currentIndex changes
  useEffect(() => {
    if (lessonData && lessonData.questions && lessonData.questions[currentIndex]) {
      const currentQuestion = lessonData.questions[currentIndex];
      const questionId = `${lessonData.lessonId || lessonData.id || 'lesson'}-q_${currentIndex}`;
      const questionType = currentQuestion.type || 'multipleChoice';
      
      console.log(`[ExercisePanel] Initializing question ${questionId}`);
      
      // Small delay to ensure React has finished rendering
      setTimeout(() => {
        questionHandler.startQuestion(questionId, questionType);
      }, 50);
    }
  }, [currentIndex, lessonData, questionHandler]);

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
    console.log('[ExercisePanel] Answer received:', answerData);
    
    // Record the answer through QuestionHandler
    const result = questionHandler.handleAnswer(
      answerData.userAnswer,
      answerData.correctAnswer,
      answerData.isCorrect
    );

    // Mark this question as completed
    const newCompleted = new Set(completedQuestions);
    newCompleted.add(currentIndex);
    setCompletedQuestions(newCompleted);

    // Call the parent callback
    if (onQuestionComplete) {
      onQuestionComplete({
        questionIndex: currentIndex,
        ...answerData,
        ...result
      });
    }

    // CRITICAL FIX: Proper delayed transition with state reset
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        console.log(`[ExercisePanel] Moving to question ${currentIndex + 1}`);
        
        // Force component re-mount by changing key
        setQuestionKey(prev => prev + 1);
        
        // Move to next question
        setCurrentIndex(currentIndex + 1);
        
      } else {
        // Lesson completed
        console.log('[ExercisePanel] All questions completed');
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
      console.log(`[ExercisePanel] Manual navigation to question ${index}`);
      setQuestionKey(prev => prev + 1); // Force re-mount on manual navigation too
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

      {/* Current question - KEY PROP FORCES RE-MOUNT */}
      <div className="question-container">
        <QuestionRenderer
          key={`${lessonData.lessonId || lessonData.id || 'lesson'}-q_${currentIndex}_${questionKey}`}
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