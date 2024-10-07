import React from "react";

const VideoPreview = ({ videoUrl }) => {
  return (
    <div className="video-preview">
      <video src={videoUrl} controls className="video-element" />
      <h2>Video Recorded Successfully!</h2>
    </div>
  );
};

export default VideoPreview;
