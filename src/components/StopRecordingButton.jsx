import React from 'react';

const StopRecordingButton = ({ onStop, disabled }) => {
  return (
    <button
      className="btn btn-danger mx-2"
      onClick={onStop}
      disabled={disabled}
    >
      Stop Recording
    </button>
  );
};

export default StopRecordingButton;
