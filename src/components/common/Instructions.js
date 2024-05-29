import React from 'react';
import PropTypes from 'prop-types';

const Instructions = ({ instructions = [] }) => {
  console.log('Rendering Instructions with instructions:', instructions);

  const paragraphs = [];
  let currentParagraph = [];

  instructions.forEach((instruction, index) => {
    // If newParagraph is true, push current paragraph to paragraphs array and start a new paragraph
    if (instruction.newParagraph) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph);
        currentParagraph = [];
      }
    }

    currentParagraph.push(
      <React.Fragment key={index}>
        {instruction.newLine && <br />}
        <span className={instruction.textStyle || 'default'}>
          {instruction.text}
        </span>
      </React.Fragment>
    );
  });

  // Push any remaining lines to paragraphs
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph);
  }

  return (
    <div className='instructions'>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="paragraph">
          {paragraph}
        </p>
      ))}
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
