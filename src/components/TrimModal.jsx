import React from "react";

const TrimModal = ({ show, onClose, onTrim }) => {
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
            <input type="text" placeholder="mm:ss" defaultValue="00:00" />
          </div>
          <div className="input-group">
            <label>End Time</label>
            <input type="text" placeholder="mm:ss" defaultValue="00:10" />
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
