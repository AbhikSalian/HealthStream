import React from "react";

const VideoActions = ({ onRetake, onUpload }) => {
  return (
    <div className="top-buttons" style={{ paddingTop: "60px" }}>
      <button className="button retake-button" onClick={onRetake}>
        Retake
      </button>
      <button className="button upload-button" onClick={onUpload}>
        Upload to Drive
      </button>
    </div>
  );
};

export default VideoActions;
