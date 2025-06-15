import React from 'react';
import PropTypes from 'prop-types';

// STATIC MAPPING - NO MORE DYNAMIC GENERATION!
const getTextStyleClass = (textStyle) => {
  switch (textStyle) {
    case 'bold': return 'bold';
    case 'italic': return 'italic';
    case 'underline': return 'underline';
    case 'strikethrough': return 'strike';
    case 'strike': return 'strike';
    default: return 'text';
  }
};

const Instructions = ({ instructions = [] }) => {
  console.log('Rendering Instructions with instructions:', instructions);

  const paragraphs = [];
  let currentParagraph = [];

  instructions.forEach((instruction, index) => {
    console.log(`Processing instruction ${index}:`, instruction);
    
    // If newParagraph is true, push current paragraph to paragraphs array and start a new paragraph
    if (instruction.newParagraph) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph);
        currentParagraph = [];
      }
    }

    // Use STATIC class mapping instead of dynamic generation
    const staticClassName = getTextStyleClass(instruction.textStyle);
    console.log(`Instruction ${index} textStyle: "${instruction.textStyle}" -> static className: "${staticClassName}"`);

    currentParagraph.push(
      <React.Fragment key={index}>
        {instruction.newLine && <br />}
        <span className={staticClassName}>
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