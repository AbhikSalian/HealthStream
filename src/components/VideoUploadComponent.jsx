import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoActions from "./VideoActions";
import VideoPreview from "./VideoPreview";
import TrimModal from "./TrimModal";
import VideoUploadHandler from "./VideoUploadHandler";
import CalendarUpload from "./CalendarUpload"; 
import Header from "./Header";
import "./VideoUploadComponent.css";

const VideoUploadComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoUrl } = location.state || {};
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [uploadDateTime, setUploadDateTime] = useState(null);
  const [successMessage, setSuccessMessage] = useState(`Video recorded and ready to upload!`); // State for success message

  const handleUploadStart = () => {
    setSuccessMessage( `Uploading video...Please wait`); // Reset message on upload start
  };

  const handleUploadSuccess = (fileName) => {
    setUploadedFileName(fileName);
    setUploadDateTime(new Date().toISOString());
    setSuccessMessage(`Video uploaded to Drive and event added successfully!`); // Set success message
  };

  const handleUploadError = () => {
    setSuccessMessage("Error uploading video. Please try again."); // Set error message if needed
  };

  const handleUploadEnd = () => {
    // Any cleanup or final actions can be done here
  };

  const { handleRecordedVideoUpload } = VideoUploadHandler({
    videoUrl,
    onUploadStart: handleUploadStart,
    onUploadSuccess: handleUploadSuccess,
    onUploadError: handleUploadError,
    onUploadEnd: handleUploadEnd,
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
          <VideoActions onRetake={handleRetake} onUpload={handleRecordedVideoUpload} />
          <VideoPreview videoUrl={videoUrl} />
          {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
          <div className="submit-buttons">
            <button className="button trim-button" onClick={handleTrim}>
              Trim Video
            </button>
            <button className="button submit-button" onClick={handleSubmit}>
              Submit Video
            </button>
          </div>
          <TrimModal show={showTrimModal} onClose={closeTrimModal} onTrim={trimVideo} />
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
