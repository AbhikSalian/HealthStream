import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoActions from "./VideoActions";
import VideoPreview from "./VideoPreview";
import TrimModal from "./TrimModal";
import VideoUploadHandler from "./VideoUploadHandler";
import CalendarUpload from "./CalendarUpload"; // Import CalendarUpload
import Header from "./Header";
import "./VideoUploadComponent.css";

const VideoUploadComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoUrl } = location.state || {};
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadDateTime, setUploadDateTime] = useState(null); // State for upload time
  const [mediaStream, setMediaStream] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploading, setUploading] = useState(false); 

  const { handleRecordedVideoUpload } = VideoUploadHandler({
    videoUrl,
    onUploadSuccess: (fileName) => {
      setUploadedFileName(fileName);
      setUploadDateTime(new Date().toISOString()); // Set current date and time
      setUploading(false);
    },
    onUploadError: (error) => {
      setErrorMessage("Upload failed: " + error.message);
      setUploading(false);
    },
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

  const handleSubmit = () => {
    setUploading(true);
    handleRecordedVideoUpload(); 
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setMediaStream(stream);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      console.log("Camera stopped");
    }
  };

  return (
    <div className="video-upload-container">
      <Header />
      {videoUrl ? (
        <>
          <VideoActions onRetake={handleRetake} onUpload={handleSubmit} />
          <VideoPreview videoUrl={videoUrl} />
          <div className="submit-buttons">
            <button className="button trim-button" onClick={handleTrim}>
              Trim Video
            </button>
            <button className="button submit-button" onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Uploading..." : "Submit Video"}
            </button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <TrimModal show={showTrimModal} onClose={closeTrimModal} onTrim={trimVideo} />
          
          {/* Calendar Upload Component */}
          {uploadedFileName && uploadDateTime && (
            <CalendarUpload fileName={uploadedFileName} uploadDateTime={uploadDateTime} />
          )}
        </>
      ) : (
        <p style={{ paddingTop: "60px" }}>No video available</p>
      )}
    </div>
  );
};

export default VideoUploadComponent;
