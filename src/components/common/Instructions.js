import React from 'react';
import PropTypes from 'prop-types';

const Instructions = ({ instructions = [] }) => {
  console.log('Rendering Instructions with instructions:', instructions);

  return (
    <div className='instructions'>
      {instructions.map((instruction, index) => {
        const Component = instruction.newParagraph ? 'p' : 'span';
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
  ).isRequired,
};

export default Instructions;
