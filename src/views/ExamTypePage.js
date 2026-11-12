// src/views/ExamTypePage.js
// Route: /exams/:examId — test selection, the exam itself, and results.
// Replaces FEDEExamPage.js and TOEICExamPage.js; any exam in the catalogue works here.

import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ExamContainer from '../components/exams/ExamContainer';
import { useContent } from '../hooks/useContent';
import { getExam } from '../catalogue/catalogue';

const countQuestions = (data) =>
  data.sections.reduce((total, section) => total + section.questions.length, 0);

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m} min`;
};

// Card for one test; loads its JSON to show question count and timing
const TestCard = ({ test, onStart }) => {
  const { data, loading, error } = useContent(test);
  return (
    <div className="test-card">
      <h3>{test.title}</h3>
      <p className="test-description">{test.description}</p>
      {data && (
        <div className="test-details">
          <span>⏱️ {formatDuration(data.timeLimit)}</span>
          <span>📝 {countQuestions(data)} questions</span>
          {data.totalPoints != null && <span>🎯 {data.totalPoints} points</span>}
        </div>
      )}
      {error && <p>This test couldn't be loaded.</p>}
      <button onClick={() => onStart(test, data)} className="start-test-btn" disabled={loading || !data}>
        {loading ? 'Loading…' : `Start ${test.title}`}
      </button>
    </div>
  );
};

const ComingSoon = ({ exam }) => (
  <div className={`exam-page ${exam.id}-exam-page`}>
    <div className="exam-header">
      <Link to="/exams" className="back-link">← Back to Exams</Link>
      <h2>{exam.title.replace(/ Exams$/, '')} Practice Tests</h2>
    </div>
    <div className="coming-soon">
      <div className="coming-soon-content">
        <h3>🚧 Coming Soon</h3>
        <p>{exam.title.replace(/ Exams$/, '')} practice tests are currently in development.</p>
        <div className="toeic-preview">
          <h4>What to expect:</h4>
          <ul>
            {exam.about.map(([label, value]) => (
              <li key={label}><strong>{label}:</strong> {value}</li>
            ))}
          </ul>
        </div>
        <div className="notification-signup">
          <Link to="/exams" className="try-fede-btn">See available practice tests →</Link>
        </div>
      </div>
    </div>
  </div>
);

const ExamTypePage = () => {
  const { examId } = useParams();
  const exam = getExam(examId);
  const [selected, setSelected] = useState(null);   // { test, data }
  const [results, setResults] = useState(null);
  const [attempt, setAttempt] = useState(0);         // bump to remount the exam for a retake

  if (!exam) return <Navigate to="/exams" replace />;
  if (exam.comingSoon) return <MainLayout layoutType="navigation"><ComingSoon exam={exam} /></MainLayout>;

  const start = (test, data) => { setSelected({ test, data }); setResults(null); setAttempt((n) => n + 1); };
  const reset = () => { setSelected(null); setResults(null); };

  const handleExamComplete = (answers, timeRemaining) => {
    const totalQuestions = countQuestions(selected.data);
    const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
    setResults({
      score: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      correctAnswers,
      totalQuestions,
      timeUsed: selected.data.timeLimit * 60 - timeRemaining,
    });
  };

  const pageClass = `exam-page ${exam.id}-exam-page`;

  // Test selection
  if (!selected) {
    return (
      <MainLayout layoutType="exam">
        <div className={pageClass}>
          <div className="exam-header">
            <Link to="/exams" className="back-link">← Back to Exams</Link>
            <h2>{exam.title.replace(/ Exams$/, '')} Practice Tests</h2>
            <p>Select a practice test to begin:</p>
          </div>
          <div className="test-selection">
            {exam.tests.map((test) => <TestCard key={test.id} test={test} onStart={start} />)}
          </div>
          <div className="exam-info">
            <h3>About {exam.title}</h3>
            <div className="info-grid">
              {exam.about.map(([label, value]) => (
                <div key={label} className="info-item"><h4>{label}</h4><p>{value}</p></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Results
  if (results) {
    return (
      <MainLayout layoutType="exam">
        <div className={pageClass}>
          <div className="exam-results-page">
            <h2>Exam Complete!</h2>
            <div className="results-summary">
              <div className="score-circle"><span className="score">{results.score}%</span></div>
              <div className="results-details">
                <p><strong>Correct Answers:</strong> {results.correctAnswers} / {results.totalQuestions}</p>
                <p><strong>Time Used:</strong> {Math.floor(results.timeUsed / 60)}:{(results.timeUsed % 60).toString().padStart(2, '0')}</p>
                <p><strong>Test:</strong> {selected.test.title}</p>
              </div>
            </div>
            <div className="results-actions">
              <button onClick={reset} className="retake-btn">Choose Another Test</button>
              <button onClick={() => start(selected.test, selected.data)} className="review-btn">Retake This Test</button>
              <Link to="/exams" className="back-btn">Back to Exams</Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // The exam
  return (
    <MainLayout layoutType="exam">
      <div className={pageClass}>
        <ExamContainer
          key={`${selected.test.id}-${attempt}`}
          examData={selected.data}
          examType={exam.id}
          onExamComplete={handleExamComplete}
        />
      </div>
    </MainLayout>
  );
};

export default ExamTypePage;
