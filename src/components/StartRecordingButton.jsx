import React from 'react';

const StartRecordingButton = ({ onStart, disabled }) => {
  return (
    <button
      className="btn btn-success mx-2"
      onClick={onStart}
      disabled={disabled}
    >
      Start Recording
    </button>
  );
};

export default StartRecordingButton;
