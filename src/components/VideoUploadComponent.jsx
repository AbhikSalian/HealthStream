import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import './VideoUploadComponent.css';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
const VideoUploadComponent = () => {
    const navigate=useNavigate();
  const location = useLocation();
  const { videoUrl } = location.state || {}; // Get the videoUrl from the location state
  const [showTrimModal, setShowTrimModal] = useState(false);

  const handleRetake = () => {
    navigate('/video-capturing');
  };

  const handleUpload = () => {
    console.log('Upload to Drive clicked');
  };

  const handleTrim = () => {
    setShowTrimModal(true);
  };

  const handleSubmit = () => {
    console.log('Submit Video clicked');
  };

  const closeTrimModal = () => {
    setShowTrimModal(false);
  };

  const trimVideo = () => {
    console.log('Video Trimmed');
    setShowTrimModal(false);
  };

  return (
    <div className="video-upload-container">
      <header className="header">
        <h1>HealthStream</h1>
        <Logout/>
      </header>

      {videoUrl ? (
        <>
          <div className="top-buttons">
            <button className="button retake-button" onClick={handleRetake}>Retake</button>
            <button className="button upload-button" onClick={handleUpload}>Upload to Drive</button>
          </div>

          <div className="video-preview">
            {/* Display the recorded video */}
            <video src={videoUrl} controls className="video-element" />
            <h2>Video Recorded Successfully!</h2>
          </div>

          <div className="submit-buttons">
            <button className="button trim-button" onClick={handleTrim}>Trim Video</button>
            <button className="button submit-button" onClick={handleSubmit}>Submit Video</button>
          </div>

          {showTrimModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeTrimModal}>&times;</span>
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
                <button className="trim-submit-button" onClick={trimVideo}>Trim</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No video available</p>
      )}
    </div>
  );
};

export default VideoUploadComponent;
