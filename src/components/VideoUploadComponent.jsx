import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoActions from "./VideoActions";
import VideoPreview from "./VideoPreview";
import TrimModal from "./TrimModal";
import VideoUploadHandler from "./VideoUploadHandler";
import Header from "./Header";
import "./VideoUploadComponent.css";

const VideoUploadComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoUrl } = location.state || {};
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const { handleRecordedVideoUpload } = VideoUploadHandler({
    videoUrl,
    onUploadSuccess: (fileName) => setUploadedFileName(fileName),
  });

  const handleRetake = () => {
    navigate("/video-capturing");
  };

  const handleTrim = () => setShowTrimModal(true);
  const closeTrimModal = () => setShowTrimModal(false);
  const trimVideo = () => {
    console.log("Video Trimmed");
    setShowTrimModal(false);
  };

  const handleSubmit = () => console.log("Submit Video clicked");

  return (
    <div className="video-upload-container">
      <Header />
      {videoUrl ? (
        <>
          <VideoActions onRetake={handleRetake} onUpload={handleRecordedVideoUpload} />
          <VideoPreview videoUrl={videoUrl} />
          <div className="submit-buttons">
            <button className="button trim-button" onClick={handleTrim}>
              Trim Video
            </button>
            <button className="button submit-button" onClick={handleSubmit}>
              Submit Video
            </button>
          </div>
          <TrimModal show={showTrimModal} onClose={closeTrimModal} onTrim={trimVideo} />
        </>
      ) : (
        <p style={{ paddingTop: "60px" }}>No video available</p>
      )}
    </div>
  );
};

export default VideoUploadComponent;
