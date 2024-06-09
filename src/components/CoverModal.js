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
    padding: '0',
    border: 'none',
    borderRadius: '10px',
    overflow: 'hidden',
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
      onRequestClose={onRequestClose} // This will close the modal on outside click or ESC key press
      style={customStyles}
      contentLabel="Cover Modal"
      shouldCloseOnOverlayClick={true} // Ensures that clicking on the overlay closes the modal
    >
      <div className="modal-content" onClick={onRequestClose} style={{ cursor: 'pointer' }}>
        <img src={coverImage} alt="Cover" className="cover-image" style={{ width: '100%', height: 'auto' }} />
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff' }}>
          <p>This app is dedicated to the Giordan Family and everyone who learns to learn</p>
          <button onClick={onRequestClose} className="close-button">Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default CoverModal;