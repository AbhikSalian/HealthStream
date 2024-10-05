import React, { useState } from 'react';
import './VideoUploadComponent.css'; 

const VideoUploadComponent = () => {
  const [videoRecorded, setVideoRecorded] = useState(true);
  const [showTrimModal, setShowTrimModal] = useState(false);

  const handleRetake = () => {
    // setVideoRecorded(false);
    console.log('Retake clicked');
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
        <button className="logout-button">Log out</button>
      </header>
      
      {videoRecorded && (
        <>
          <div className="top-buttons">
            <button className="button retake-button" onClick={handleRetake}>Retake</button>
            <button className="button upload-button" onClick={handleUpload}>Upload to Drive</button>
          </div>

          <div className="video-preview">
            <img 
              src="https://via.placeholder.com/300x400" 
              alt="Video Thumbnail" 
              className="video-thumbnail"
            />
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
      )}
    </div>
  );
};

export default VideoUploadComponent;
