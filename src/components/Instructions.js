//Instructions.js
import React from 'react';
import PropTypes from 'prop-types'

const Instructions = ({ instructions = [] }) => {
  if (!Array.isArray(instructions)) {
    return null; // Or render some fallback UI
  }

  return (
    <div>
      {instructions.map((instruction, index) => {
        let className = 'text'; // Default class
        switch (instruction.textStyle) {
            case 'italic':
            className = 'italic';
            break;
            case 'bold':
            className = 'bold';
            break;
          case 'underline':
            className = 'underline';
            break;
          default:
            break; // Default case or logging unexpected types
        }

        return <span key={index} className={className}>{instruction.text}</span>;
      })}
    </div>
  );
};
// Define propTypes for the component after the component definition
Instructions.propTypes = {
    instructions: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'bold', 'italic', 'underlined']),
      })
    ),
  };
export default Instructions;