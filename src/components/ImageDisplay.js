import React from 'react';

function ImageDisplay({ imagePath, altText }) {
  return (
    <div>
      <img src={imagePath} alt={altText} style={{ maxWidth: '200px', maxHeight: '200px' }} />
    </div>
  );
}

export default ImageDisplay;
