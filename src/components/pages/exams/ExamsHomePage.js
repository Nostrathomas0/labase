// ExamsHomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ExamsHomePage = () => {
  return (
    <div className="exams-home">
      <h2>Practice Exams</h2>
      <p>Choose an exam type to practice:</p>
      
      <div className="exam-types">
        <div className="exam-card">
          <h3>FEDE Exams</h3>
          <p>
            <strong>Format:</strong> Reading comprehension + Gap fill<br/>
            <strong>Time:</strong> 1h45<br/>
            <strong>Level:</strong> B2 (CECR)<br/>
            <strong>Available:</strong> 2 practice tests
          </p>
          <p className="exam-description">
            The FEDE (Fédération Européenne des Écoles) English exam tests your reading comprehension 
            and language skills through multiple-choice questions and gap-fill exercises.
          </p>
          <Link to="/exams/fede" className="exam-link">
            Start FEDE Practice →
          </Link>
        </div>

        <div className="exam-card">
          <h3>TOEIC Exams</h3>
          <p>
            <strong>Format:</strong> Listening + Reading<br/>
            <strong>Time:</strong> 2h<br/>
            <strong>Level:</strong> All levels<br/>
            <strong>Available:</strong> Coming soon
          </p>
          <p className="exam-description">
            The TOEIC (Test of English for International Communication) measures your English 
            proficiency in business and everyday contexts.
          </p>
          <Link to="/exams/toeic" className="exam-link disabled">
            Coming Soon
          </Link>
        </div>
      </div>

      <div className="exam-tips">
        <h3>Exam Tips</h3>
        <ul>
          <li><strong>Time Management:</strong> Keep track of time for each section</li>
          <li><strong>Read Carefully:</strong> Pay attention to keywords in questions</li>
          <li><strong>Free Navigation:</strong> You can jump between texts and questions freely</li>
          <li><strong>Review:</strong> Check your answers before submitting</li>
        </ul>
      </div>
    </div>
  );
};

export default ExamsHomePage;