// ImageDisplay.js
import React from 'react';
import imageMap from '../imageMap';

function ImageDisplay({ imagePath, altText }) {
  const ImageSrc = imageMap[imagePath];

  return <img src={ImageSrc} alt={altText} />;
}

export default ImageDisplay;
