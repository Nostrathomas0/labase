// CoverModal.js
import React from 'react';
import { useAuth } from './AuthContext';

const CoverModal = ({ isOpen, onClose }) => {
  // Get user email from Auth Context
  const { userEmail, currentUser } = useAuth();
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modal-header">
          {currentUser && userEmail ? (
            <h2>Welcome back, {userEmail}!</h2>
          ) : (
            <h2>Welcome to our platform!</h2>
          )}
        </div>
        
        <div className="modal-body">
          {/* Modal content */}
          <p>Your content here...</p>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
          {/* Other buttons */}
        </div>
      </div>
    </div>
  );
};

export default CoverModal;