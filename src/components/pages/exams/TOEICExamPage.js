// TOEICExamPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const TOEICExamPage = () => {
  return (
    <div className="toeic-exam-page">
      <div className="exam-header">
        <Link to="/exams" className="back-link">← Back to Exams</Link>
        <h2>TOEIC Practice Tests</h2>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <h3>🚧 Coming Soon</h3>
          <p>TOEIC practice tests are currently in development.</p>
          
          <div className="toeic-preview">
            <h4>What to expect:</h4>
            <ul>
              <li><strong>Listening Section:</strong> 45 minutes, 100 questions</li>
              <li><strong>Reading Section:</strong> 75 minutes, 100 questions</li>
              <li><strong>Score Range:</strong> 10-990 points</li>
              <li><strong>Question Types:</strong> Multiple choice, audio comprehension</li>
            </ul>
          </div>

          <div className="notification-signup">
            <h4>Get notified when TOEIC tests are ready:</h4>
            <p>We'll add TOEIC practice tests soon. For now, try our FEDE exams to practice your English skills!</p>
            <Link to="/exams/fede" className="try-fede-btn">
              Try FEDE Practice Tests →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TOEICExamPage;