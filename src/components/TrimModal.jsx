import React, { useState } from "react";

const TrimModal = ({ show, onClose, onTrim }) => {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:10");

  const handleTrim = () => {
    const startSeconds = convertTimeToSeconds(startTime);
    const endSeconds = convertTimeToSeconds(endTime);
    onTrim(startSeconds, endSeconds); // Pass start and end seconds
  };

  const convertTimeToSeconds = (time) => {
    const parts = time.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3>Trim Video</h3>
        <div className="trim-inputs">
          <div className="input-group">
            <label>Start time</label>
            <input
              type="text"
              placeholder="mm:ss"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>End Time</label>
            <input
              type="text"
              placeholder="mm:ss"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <button className="trim-submit-button" onClick={handleTrim}>
          Trim
        </button>
      </div>
    </div>
  );
};

export default TrimModal;
