// FEDEExamPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExamContainer from '../../exams/ExamContainer';

// Import your practice test data
import Jan2023 from '../../../data/exams/fede/Jan2023.json';
import Juin2023 from '../../../data/exams/fede/Juin2023.json';

const FEDEExamPage = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [examResults, setExamResults] = useState(null);

  const practiceTests = [
    {
      id: 'test1',
      title: 'FEDE Practice Test 1',
      description: 'Amazon Growth, iPhone Factory, Biden Car Persona',
      data: Juin2023
    },
    {
      id: 'test2', 
      title: 'FEDE Practice Test 2',
      description: 'Drought Risk, Elon Musk Twitter, Europe Energy',
      data: Jan2023
    }
  ];

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setExamResults(null);
  };

  const handleExamComplete = (answers, timeRemaining) => {
    // Calculate results
    const totalQuestions = selectedTest.data.sections.reduce(
      (total, section) => total + section.questions.length, 0
    );
    const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    setExamResults({
      score,
      correctAnswers,
      totalQuestions,
      timeUsed: selectedTest.data.timeLimit * 60 - timeRemaining,
      answers
    });
  };

  const resetExam = () => {
    setSelectedTest(null);
    setExamResults(null);
  };

  // If no test is selected, show test selection
  if (!selectedTest) {
    return (
      <div className="fede-exam-page">
        <div className="exam-header">
          <Link to="/exams" className="back-link">← Back to Exams</Link>
          <h2>FEDE Practice Tests</h2>
          <p>Select a practice test to begin:</p>
        </div>

        <div className="test-selection">
          {practiceTests.map((test) => (
            <div key={test.id} className="test-card">
              <h3>{test.title}</h3>
              <p className="test-description">{test.description}</p>
              <div className="test-details">
                <span>⏱️ 1h45</span>
                <span>📝 {test.data.sections.reduce((total, section) => total + section.questions.length, 0)} questions</span>
                <span>🎯 {test.data.totalPoints} points</span>
              </div>
              <button 
                onClick={() => handleTestSelect(test)}
                className="start-test-btn"
              >
                Start {test.title}
              </button>
            </div>
          ))}
        </div>

        <div className="exam-info">
          <h3>About FEDE Exams</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>Format</h4>
              <p>3 reading texts with multiple choice and gap-fill questions</p>
            </div>
            <div className="info-item">
              <h4>Navigation</h4>
              <p>Free movement between texts and questions</p>
            </div>
            <div className="info-item">
              <h4>Scoring</h4>
              <p>3 points per correct answer, 0 for incorrect/blank</p>
            </div>
            <div className="info-item">
              <h4>Level</h4>
              <p>B2 level (CECR framework)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If exam is completed, show results
  if (examResults) {
    return (
      <div className="fede-exam-page">
        <div className="exam-results-page">
          <h2>Exam Complete!</h2>
          <div className="results-summary">
            <div className="score-circle">
              <span className="score">{examResults.score}%</span>
            </div>
            <div className="results-details">
              <p><strong>Correct Answers:</strong> {examResults.correctAnswers} / {examResults.totalQuestions}</p>
              <p><strong>Time Used:</strong> {Math.floor(examResults.timeUsed / 60)}:{(examResults.timeUsed % 60).toString().padStart(2, '0')}</p>
              <p><strong>Test:</strong> {selectedTest.title}</p>
            </div>
          </div>
          
          <div className="results-actions">
            <button onClick={resetExam} className="retake-btn">
              Choose Another Test
            </button>
            <button 
              onClick={() => setSelectedTest({...selectedTest})} 
              className="review-btn"
            >
              Retake This Test
            </button>
            <Link to="/exams" className="back-btn">
              Back to Exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show the actual exam
  return (
    <div className="fede-exam-page">
      <ExamContainer
        examData={selectedTest.data}
        examType="fede"
        onExamComplete={handleExamComplete}
      />
    </div>
  );
};

export default FEDEExamPage;