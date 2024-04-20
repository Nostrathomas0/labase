import React from 'react';
import PropTypes from 'prop-types';

const Instructions = ({ instructions = [] }) => {
  if (!Array.isArray(instructions)) {
    return null; // Or render some fallback UI
  }

  return (
    <div className='instructions'>
      {instructions.map((instruction, index) => {
        // Decide on the wrapper component based on the instruction properties
        const Component = instruction.newParagraph ? 'p' : 'span';

        // Apply a line break if needed, before the actual text
        return (
          <React.Fragment key={index}>
            {instruction.newLine && <br />}
            <Component className={instruction.textStyle || 'default'}>
              {instruction.text}
            </Component>
            {instruction.newParagraph && <br />} 
          </React.Fragment>
        );
      })}
    </div>
  );
};

Instructions.propTypes = {
  instructions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      textStyle: PropTypes.string,
      newLine: PropTypes.bool,
      newParagraph: PropTypes.bool
    })
  ),
};

export default Instructions;
