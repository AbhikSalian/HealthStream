import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoActions from "./VideoActions";
import VideoPreview from "./VideoPreview";
import VideoUploadHandler from "./VideoUploadHandler";
import CalendarUpload from "./CalendarUpload"; 
import Header from "./Header";
import Trimmer from "./Trimmer";
import "../css/VideoUploadComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const VideoUploadComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoUrl } = location.state || {};
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [uploadDateTime, setUploadDateTime] = useState(null);
  const [successMessage, setSuccessMessage] = useState(`Video recorded and ready to upload!`);
  
  // State to hold trim start and end times
  const [trimStartTime, setTrimStartTime] = useState("00:00");
  const [trimEndTime, setTrimEndTime] = useState("00:10");

  const handleUploadStart = () => {
    setSuccessMessage(`Uploading video...Please wait`);
  };

  const handleUploadSuccess = (fileName) => {
    setUploadedFileName(fileName);
    setUploadDateTime(new Date().toISOString());
    setSuccessMessage(`Video uploaded to Drive and event added successfully!`);
  };

  const handleUploadError = () => {
    setSuccessMessage("Error uploading video. Please try again.");
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
    console.log("Trimming video from:", trimStartTime, "to:", trimEndTime);
    
    // Here you would implement your video trimming logic
    // For example, using a library like ffmpeg.js
    // After trimming, you might update the videoUrl state or handle it accordingly.

    setShowTrimModal(false);
  };

  const handleSubmit = () => navigate('/video-submitted');

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
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="submit-buttons">
            {/* <button className="button trim-button" onClick={handleTrim}>
              Trim Video
            </button> */}
            {/* <Trimmer/> */}
            <button className="button submit-button" onClick={handleSubmit}><FontAwesomeIcon icon={faCheck}/></button>
          </div>
          {/* <TrimModal 
            show={showTrimModal} 
            onClose={closeTrimModal} 
            onTrim={trimVideo} 
            video={videoUrl}
            setTrimStartTime={setTrimStartTime} 
            setTrimEndTime={setTrimEndTime} 
          /> */}
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
