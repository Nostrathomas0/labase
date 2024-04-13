//Instructions.js
import React from 'react';
import PropTypes from 'prop-types'

const Instructions = ({ instructions = [] }) => {
  if (!Array.isArray(instructions)) {
    return null; // Or render some fallback UI
  }

  return (
    <div className='instructions'>
      {instructions.map((instruction, index) => (
        <span key={index} className={instruction.text || 'default'}>
          {instructions.textStyle}
        </span>
      ))}
    </div>
  );
};
// Define propTypes for the component after the component definition
Instructions.propTypes = {
    instructions: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        typeStyle: PropTypes.string
      })
    ),
  };
export default Instructions;