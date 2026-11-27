// ImageDisplay.js
import React from 'react';
import imageMap from '../../imageMap';

function ImageDisplay({ imagePath, altText = 'image' }) {
  const ImageSrc = imageMap[imagePath];
   // Add this line for debugging

  if (!ImageSrc) {
    console.error(`Image not found for path: ${imagePath}`);
    return null; // Render nothing or a placeholder
  }

  return <img src={ImageSrc} alt={altText} />;
}

export default ImageDisplay;
