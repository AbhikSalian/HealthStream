// StopRecordingButton.js
import React from 'react';

const StopRecordingButton = ({ onStop, disabled }) => {
  return (
    <button
      className="btn btn-danger btn-sm mx-1" // Added 'btn-sm' for smaller size
      onClick={onStop}
      disabled={disabled}
    >
      Stop Recording
    </button>
  );
};