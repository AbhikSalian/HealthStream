import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
const VideoActions = ({ onRetake, onUpload }) => {
  return (
    <div className="top-buttons" style={{ paddingTop: "60px" }}>
      <button className="button retake-button" onClick={onRetake}>
        Retake <FontAwesomeIcon icon={faRepeat} />
      </button>
      <button className="button upload-button" onClick={onUpload}>
        Upload to <FontAwesomeIcon icon={faGoogleDrive} />
      </button>
    </div>
  );
};

export default VideoActions;
