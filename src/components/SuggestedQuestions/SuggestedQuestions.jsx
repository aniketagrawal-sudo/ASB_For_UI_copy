// src/components/SuggestedQuestions/SuggestedQuestions.jsx
import React from 'react';
import PropTypes from 'prop-types';
import classes from './SuggestedQuestions.module.scss';

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  // The component will automatically render nothing if there are no questions.
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className={classes.container}>
      <h4 className={classes.title}>Related:</h4>
      <div className={classes.list}>
        {questions.map((question, index) => (
          <button
            key={index}
            className={classes.questionButton}
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

SuggestedQuestions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  // The click handler is optional, preventing warnings when not needed.
  onQuestionClick: PropTypes.func,
};

export default SuggestedQuestions;