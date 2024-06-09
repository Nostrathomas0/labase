import React from 'react';
import Modal from 'react-modal';
import coverImage from '../assets/images/Cover.png'; // Adjust the path to your cover image

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

Modal.setAppElement('#root');

const CoverModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Cover Modal"
    >
      <div className="modal-content">
        <img src={coverImage} alt="Cover" className="cover-image" />
        <p>This app is dedicated to ...</p>
        <button onClick={onRequestClose} className="close-button">Close</button>
      </div>
    </Modal>
  );
};

export default CoverModal;
