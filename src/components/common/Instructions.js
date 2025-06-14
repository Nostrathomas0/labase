import React from 'react';
import PropTypes from 'prop-types';

// Helper function to create safe CSS class names
const createSafeClassName = (str) => {
  if (!str) return 'default';
  
  try {
    // Convert to string first
    const stringValue = String(str);
    
    // Convert to lowercase and replace invalid characters with hyphens
    let className = stringValue.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Remove leading/trailing hyphens and multiple consecutive hyphens
    className = className.replace(/^-+|-+$/g, '').replace(/-+/g, '-');
    
    // Ensure it doesn't start with a digit
    if (/^[0-9]/.test(className)) {
      className = 'text-' + className;
    }
    
    // Fallback if empty
    if (!className) {
      className = 'default';
    }
    
    return className;
  } catch (error) {
    console.error('Error creating safe className:', error, 'input was:', str);
    return 'default';
  }
};

const Instructions = ({ instructions = [] }) => {
  console.log('Rendering Instructions with instructions:', instructions);

  const paragraphs = [];
  let currentParagraph = [];

  instructions.forEach((instruction, index) => {
    // Log each instruction to help debug
    console.log(`Processing instruction ${index}:`, instruction);
    
    // If newParagraph is true, push current paragraph to paragraphs array and start a new paragraph
    if (instruction.newParagraph) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph);
        currentParagraph = [];
      }
    }

    // Create safe className from textStyle
    const safeClassName = createSafeClassName(instruction.textStyle);
    console.log(`Instruction ${index} textStyle: "${instruction.textStyle}" -> safe className: "${safeClassName}"`);

    currentParagraph.push(
      <React.Fragment key={index}>
        {instruction.newLine && <br />}
        <span className={safeClassName}>
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