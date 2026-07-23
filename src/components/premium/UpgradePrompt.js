// src/components/premium/UpgradePrompt.js
import React from 'react';
import MainLayout from '../layout/MainLayout';

const upgradeData = {
  title: 'Premium Content',
  pages: [{
    questions: [{
      type: 'instructions',
      instructions: [{
        text: 'This lesson is available to premium members.',
        textStyle: 'default'
      }]
    }]
  }]
};

const UpgradePrompt = () => {
  return (
    <MainLayout lessonData={upgradeData} layoutType="lesson">
      <div className="upgrade-prompt">
        <div className="upgrade-content">
          <h2>Unlock Premium Access</h2>
          <ul className="premium-features">
            <li>Drag-and-drop grammar activities</li>
            <li>Full IELTS practice exam sets</li>
            <li>Progress tracking and certificates</li>
          </ul>
          <a href="/upgrade" className="upgrade-btn">
            Upgrade Now
          </a>
          <p className="upgrade-sub">
            Already a member? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default UpgradePrompt;