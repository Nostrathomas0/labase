import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../layout/MainLayout';
import { ProgressManager } from '../../utils/ProgressManager';

const ExamContainer = ({ examData, examType = 'fede', onExamComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(examData.timeLimit * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progressManager] = useState(() => new ProgressManager());

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer, isCorrect) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { answer, isCorrect, timestamp: new Date().toISOString() }
    }));
  };

  const handleExamComplete = useCallback(() => {
    setShowResults(true);
    setExamStarted(false);
    if (onExamComplete) {
      onExamComplete(answers, timeRemaining);
    }
  }, [onExamComplete, answers, timeRemaining]);

  // Timer effect
  useEffect(() => {
    if (examStarted && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleExamComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining, showResults, handleExamComplete]);

  const startExam = () => {
    setExamStarted(true);
    // Start progress session for the exam
    progressManager.startSession('EXAM', examType.toUpperCase(), currentSection + 1);
  };

  const getCurrentSection = () => examData.sections[currentSection];

  const navigateToSection = (sectionIndex) => {
    setCurrentSection(sectionIndex);
    // Update progress manager session
    progressManager.startSession('EXAM', examType.toUpperCase(), sectionIndex + 1);
  };

  // Pre-exam screen
  if (!examStarted && !showResults) {
    return (
      <div className="exam-container">
        <div className="exam-header">
          <h1>{examData.title}</h1>
          <div className="exam-info">
            <p><strong>Time Limit:</strong> {examData.timeLimit} minutes</p>
            <p><strong>Sections:</strong> {examData.sections.length}</p>
            <p><strong>Total Questions:</strong> {examData.sections.reduce((total, section) => total + section.questions.length, 0)}</p>
          </div>
          {examData.instructions && (
            <div className="exam-instructions">
              <div className="instructions-content">
                {examData.instructions.map((instruction, index) => (
                  <div key={index} className={`instruction-${instruction.textStyle || 'default'}`}>
                    {instruction.newParagraph && <br />}
                    {instruction.newLine && <br />}
                    <span className={instruction.textStyle}>{instruction.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button className="start-exam-btn" onClick={startExam}>
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const totalQuestions = examData.sections.reduce((total, section) => total + section.questions.length, 0);
    const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="exam-container">
        <div className="exam-results">
          <h1>Exam Complete!</h1>
          <div className="score-summary">
            <h2>Your Score: {score}%</h2>
            <p>Correct Answers: {correctAnswers} / {totalQuestions}</p>
            <p>Time Used: {formatTime(examData.timeLimit * 60 - timeRemaining)}</p>
          </div>
          
          <div className="section-breakdown">
            {examData.sections.map((section, sectionIndex) => {
              const sectionAnswers = Object.entries(answers)
                .filter(([key]) => key.startsWith(`${sectionIndex}-`))
                .map(([, value]) => value);
              const sectionCorrect = sectionAnswers.filter(answer => answer.isCorrect).length;
              const sectionTotal = section.questions.length;
              
              return (
                <div key={sectionIndex} className="section-result">
                  <h3>{section.title}</h3>
                  <p>{sectionCorrect} / {sectionTotal} correct ({Math.round((sectionCorrect / sectionTotal) * 100)}%)</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // MAIN EXAM INTERFACE - Using MainLayout for left-right split
  const currentSectionData = getCurrentSection();
  
  // Prepare left content (reading passage/text)
  const leftContent = (
    <div className="exam-left-content">
      {/* Exam Header with Timer and Navigation */}
      <div className="exam-header-controls">
        <div className="exam-title">{examData.title}</div>
        <div className="exam-timer">
          Time Remaining: {formatTime(timeRemaining)}
        </div>
        <button className="finish-exam-btn" onClick={handleExamComplete}>
          Finish Exam
        </button>
      </div>

      {/* Section Navigation Tabs */}
      <div className="section-navigation">
        {examData.sections.map((section, index) => (
          <button
            key={index}
            className={`section-tab ${currentSection === index ? 'active' : ''}`}
            onClick={() => navigateToSection(index)}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Reading Passage/Text Content */}
      <div className="reading-content">
        <h3>{currentSectionData?.title}</h3>
        {currentSectionData?.text && (
          <div className="reading-passage">
            {currentSectionData.text.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
        {currentSectionData?.image && (
          <div className="section-image">
            <img src={currentSectionData.image} alt={currentSectionData.title} />
          </div>
        )}
      </div>
    </div>
  );

  // Prepare exercise data for right panel
  const exerciseData = {
    title: currentSectionData?.title || 'Questions',
    questions: currentSectionData?.questions || [],
    lessonId: `exam-${examType}-section-${currentSection}`,
    type: 'exam'
  };

  const handleQuestionComplete = (answerData) => {
    const questionId = `${currentSection}-${answerData.questionIndex}`;
    handleAnswer(questionId, answerData.userAnswer, answerData.isCorrect);
  };

  const handleSectionComplete = (completionData) => {
    console.log('Section completed:', completionData);
    // Auto-advance to next section or complete exam
    if (currentSection < examData.sections.length - 1) {
      setTimeout(() => {
        navigateToSection(currentSection + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        handleExamComplete();
      }, 2000);
    }
  };

  return (
    <MainLayout
      layoutType="exam"
      leftContent={leftContent}
      lessonData={exerciseData}
      progressManager={progressManager}
      onQuestionComplete={handleQuestionComplete}
      onLessonComplete={handleSectionComplete}
    />
  );
};

export default ExamContainer;