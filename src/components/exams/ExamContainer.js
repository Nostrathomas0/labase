import React, { useState, useEffect, useCallback } from 'react';
import MultipleChoice from '../common/MultipleChoice';
import GapFill from '../common/GapFill';
import ClickActivity from '../common/ClickActivity';
import WordBankActivity from '../common/WordBankActivity';
import ImageDisplay from '../common/ImageDisplay';
import Instructions from '../common/Instructions';

const ExamContainer = ({ examData, examType = 'fede', onExamComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(examData.timeLimit * 60); // Convert minutes to seconds
  const [examStarted, setExamStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
  };

  const getCurrentSection = () => examData.sections[currentSection];
  const getCurrentQuestion = () => getCurrentSection()?.questions[currentQuestion];

  const navigateToSection = (sectionIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestion(0);
  };

  const navigateToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const renderQuestion = (question) => {
    const questionId = `${currentSection}-${currentQuestion}`;
    
    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            question={question.question}
            options={question.options}
            correctAnswer={question.correctAnswer}
            onAnswer={(isCorrect) => handleAnswer(questionId, question.options.find(opt => opt === question.correctAnswer), isCorrect)}
          />
        );
      
      case 'gap-fill':
        return (
          <GapFill
            template={question.template}
            correctAnswers={question.correctAnswers}
            onAnswer={(isCorrect) => handleAnswer(questionId, question.correctAnswers[0], isCorrect)}
          />
        );
      
      case 'click-activity':
        return (
          <ClickActivity
            instructions={question.instructions}
            words={question.words}
            keyWords={question.keyWords}
            onAnswer={(isCorrect) => handleAnswer(questionId, question.keyWords, isCorrect)}
          />
        );
      
      case 'word-bank':
        return (
          <WordBankActivity
            paragraph={question.paragraph}
            wordBank={question.wordBank}
            correctAnswers={question.correctAnswers}
            onAnswer={(isCorrect) => handleAnswer(questionId, question.correctAnswers, isCorrect)}
          />
        );
      
      default:
        return <div>Unknown question type: {question.type}</div>;
    }
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
              <Instructions instructions={examData.instructions} />
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

  // Main exam interface
  return (
    <div className="exam-container">
      {/* Exam Header */}
      <div className="exam-header">
        <div className="exam-title">{examData.title}</div>
        <div className="exam-timer">
          Time Remaining: {formatTime(timeRemaining)}
        </div>
        <button className="finish-exam-btn" onClick={handleExamComplete}>
          Finish Exam
        </button>
      </div>

      <div className="exam-content">
        {examType === 'fede' ? (
          // FEDE Layout: Free navigation between texts/sections
          <div className="fede-layout">
            {/* Section Navigation */}
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

            <div className="fede-content">
              {/* Left Side: Text/Reading Passage */}
              <div className="text-panel">
                <h3>{getCurrentSection()?.title}</h3>
                {getCurrentSection()?.text && (
                  <div className="reading-passage">
                    <p>{getCurrentSection().text}</p>
                  </div>
                )}
                {getCurrentSection()?.image && (
                  <ImageDisplay 
                    imagePath={getCurrentSection().image} 
                    altText={getCurrentSection().title} 
                  />
                )}
              </div>

              {/* Right Side: Questions */}
              <div className="questions-panel">
                {/* Question Navigation */}
                <div className="question-navigation">
                  {getCurrentSection()?.questions.map((_, index) => {
                    const questionId = `${currentSection}-${index}`;
                    const isAnswered = answers[questionId];
                    
                    return (
                      <button
                        key={index}
                        className={`question-number ${currentQuestion === index ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                        onClick={() => navigateToQuestion(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Current Question */}
                <div className="current-question">
                  {getCurrentQuestion() && (
                    <>
                      <div className="question-header">
                        <span className="question-label">
                          Question {currentQuestion + 1} of {getCurrentSection().questions.length}
                        </span>
                      </div>
                      {renderQuestion(getCurrentQuestion())}
                    </>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="question-controls">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="nav-btn prev-btn"
                  >
                    Previous Question
                  </button>
                  <button
                    onClick={() => setCurrentQuestion(Math.min(getCurrentSection().questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === getCurrentSection().questions.length - 1}
                    className="nav-btn next-btn"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // TOEIC Layout: Sequential sections with stricter navigation
          <div className="toeic-layout">
            <div className="section-progress">
              Section {currentSection + 1} of {examData.sections.length}: {getCurrentSection()?.title}
            </div>
            
            <div className="toeic-content">
              {/* Reading passage or audio prompt */}
              {getCurrentSection()?.text && (
                <div className="passage-panel">
                  <p>{getCurrentSection().text}</p>
                </div>
              )}
              
              {/* Current Question */}
              <div className="question-panel">
                {getCurrentQuestion() && renderQuestion(getCurrentQuestion())}
                
                <div className="toeic-navigation">
                  <button
                    onClick={() => {
                      if (currentQuestion > 0) {
                        setCurrentQuestion(currentQuestion - 1);
                      } else if (currentSection > 0) {
                        setCurrentSection(currentSection - 1);
                        setCurrentQuestion(examData.sections[currentSection - 1].questions.length - 1);
                      }
                    }}
                    disabled={currentSection === 0 && currentQuestion === 0}
                    className="nav-btn"
                  >
                    Previous
                  </button>
                  
                  <span className="question-counter">
                    Question {currentQuestion + 1} of {getCurrentSection().questions.length}
                  </span>
                  
                  <button
                    onClick={() => {
                      if (currentQuestion < getCurrentSection().questions.length - 1) {
                        setCurrentQuestion(currentQuestion + 1);
                      } else if (currentSection < examData.sections.length - 1) {
                        setCurrentSection(currentSection + 1);
                        setCurrentQuestion(0);
                      }
                    }}
                    disabled={
                      currentSection === examData.sections.length - 1 && 
                      currentQuestion === getCurrentSection().questions.length - 1
                    }
                    className="nav-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamContainer;