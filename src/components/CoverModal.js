import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import coverImage from '../assets/images/Cover.png'; // Adjust the path to your cover image

Modal.setAppElement('#root');

const CoverModal = ({ isOpen, onRequestClose }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');

  if(!isOpen) return null;

  const handleNameSubmit = () => {
    console.log("User's name:", name);
    onRequestClose();
  };

  return (
    <div className="cover-modal-container">
      <img src={coverImage} alt="Cover" />

      {user ? (
        <h2>Welcome, {user.email}!</h2>
      ) : (
        <div>
          <h2>Welcome to Languapps</h2>
          <p>Please enter your name:</p>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="cover-modal-input"
          />
          <button onClick={handleNameSubmit} className="cover-modal-button">
            Submit
          </button>
        </div>
      )}

      <button onClick={onRequestClose} className="cover-modal-button close">
        Close
      </button>
    </div>
  );
};

CoverModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default CoverModal;