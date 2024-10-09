import React from "react";

const VideoPreview = ({ videoUrl }) => {
  return (
    <div className="video-preview">
      <video src={videoUrl} controls className="video-element" />
    </div>
  );
};

export default VideoPreview;
