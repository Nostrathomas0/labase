import React from 'react';
import PropTypes from 'prop-types';

const Instructions = ({ instructions = [] }) => {
  if (!Array.isArray(instructions)) {
    return null; // Or render some fallback UI
  }

  return (
    <div className='instructions'>
      {instructions.map((instruction, index) => {
        // Logging each instruction object to see what is received
        console.log('Instruction:', instruction);

        return (
          <span key={index} className={instruction.textStyle || 'default'}>
            {instruction.text}
          </span>
        );
      })}
    </div>
  );
};

// Define propTypes for the component after the component definition
Instructions.propTypes = {
  instructions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      textStyle: PropTypes.string
    })
  ),
};

export default Instructions;
