// src/views/ExamsHomePage.js
// Route: /exams — lists exam types from the catalogue

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { EXAMS } from '../catalogue/catalogue';

const ExamsHomePage = () => (
  <MainLayout layoutType="navigation">
    <div className="exams-home">
      <h2>Practice Exams</h2>
      <p>Choose an exam type to practice:</p>

      <div className="exam-types">
        {EXAMS.map((exam) => (
          <div key={exam.id} className="exam-card">
            <h3>{exam.title}</h3>
            <p>
              {exam.summary.map(([label, value]) => (
                <React.Fragment key={label}>
                  <strong>{label}:</strong> {value}<br />
                </React.Fragment>
              ))}
              <strong>Available:</strong>{' '}
              {exam.comingSoon
                ? 'Coming soon'
                : `${exam.tests.length} practice test${exam.tests.length === 1 ? '' : 's'}`}
            </p>
            <p className="exam-description">{exam.description}</p>
            <Link to={`/exams/${exam.id}`} className={`exam-link${exam.comingSoon ? ' disabled' : ''}`}>
              {exam.comingSoon ? 'Coming Soon' : `Start ${exam.title.replace(/ Exams$/, '')} Practice →`}
            </Link>
          </div>
        ))}
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
  </MainLayout>
);

export default ExamsHomePage;
