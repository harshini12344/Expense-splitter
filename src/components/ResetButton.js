import React from 'react';
import './Components.css';

const ResetButton = ({ onReset }) => {
  return (
    <button onClick={onReset} className="btn btn-reset">
      <span className="reset-icon">↺</span>
      Reset Everything
    </button>
  );
};

export default ResetButton;