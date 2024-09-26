// StartRecordingButton.js
import React from 'react';

const StartRecordingButton = ({ onStart, disabled }) => {
  return (
    <button
      className="btn btn-primary btn-sm mx-1" // Added 'btn-sm' for smaller size
      onClick={onStart}
      disabled={disabled}
    >
      Start Recording
    </button>
  );
};

export default StartRecordingButton;