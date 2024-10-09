import React from "react";

const TrimModal = ({ show, onClose, onTrim, video, setTrimStartTime, setTrimEndTime }) => {
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
              defaultValue="00:00" 
              onChange={(e) => setTrimStartTime(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label>End Time</label>
            <input 
              type="text" 
              placeholder="mm:ss" 
              defaultValue="00:10" 
              onChange={(e) => setTrimEndTime(e.target.value)} 
            />
          </div>
        </div>
        <button className="trim-submit-button" onClick={onTrim}>
          Trim
        </button>
      </div>
    </div>
  );
};

export default TrimModal;
