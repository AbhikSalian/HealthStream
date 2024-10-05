import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import "./VideoUploadComponent.css";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import {CalendarUpload} from "./CalendarUpload";
import { useSelector } from "react-redux";
const VideoUploadComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoUrl } = location.state || {}; // Get the videoUrl from the location state
  const [showTrimModal, setShowTrimModal] = useState(false);
  const FOLDER_NAME = "video-recorder-uploads";
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadDateTime, setUploadDateTime] = useState(null); // State for calendar
//   const { videoUrl } = useSelector((state) => state.video);
  const { token } = useSelector((state) => state.auth);
  const handleRetake = () => {
    navigate("/video-capturing");
  };
  const getOrCreateFolder = async () => {
    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`,
        {
          method: "GET",
          headers: new Headers({ Authorization: "Bearer " + token }),
        }
      );
      const searchData = await searchResponse.json();
      if (searchData.files && searchData.files.length > 0) {
        return searchData.files[0].id;
      }
      const metadata = {
        name: FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder",
      };
      const createResponse = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(metadata),
        }
      );
      const createData = await createResponse.json();
      return createData.id;
    } catch (error) {
      console.error("Error in creating or fetching folder:", error);
    }
  };
  const uploadFileToDrive = async (file, fileName) => {
    try {
      const folderId = await getOrCreateFolder();
      const metadata = {
        name: fileName,
        parents: [folderId],
        mimeType: file.type,
      };

      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append("file", file);

      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({ Authorization: "Bearer " + token }),
          body: formData,
        }
      );
      const data = await response.json();
      console.log("File uploaded successfully", data);

      setUploadedFileName(fileName);
      const timestamp = new Date().toISOString();
      setUploadDateTime(timestamp);

      alert(`File uploaded successfully`);
      await CalendarUpload(uploadedFileName, uploadDateTime);
    } catch (error) {
      console.error("Error uploading file to Drive:", error);
    }
  };
  const handleRecordedVideoUpload = async () => {
    if (!videoUrl) {
      console.log("No recorded video to upload");
      return;
    }
    try {
      const blob = await fetch(videoUrl).then((res) => res.blob());
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `video-${timestamp}.webm`;
      const file = new File([blob], fileName, { type: "video/webm" });
      await uploadFileToDrive(file, fileName);
    } catch (error) {
      console.error("Error uploading recorded video:", error);
    }
  };

  const handleTrim = () => {
    setShowTrimModal(true);
  };

  const handleSubmit = () => {
    console.log("Submit Video clicked");
  };

  const closeTrimModal = () => {
    setShowTrimModal(false);
  };

  const trimVideo = () => {
    console.log("Video Trimmed");
    setShowTrimModal(false);
  };

  return (
    <div className="video-upload-container">
      <header className="header">
        <h1>HealthStream</h1>
        <Logout />
      </header>

      {videoUrl ? (
        <>
          <div className="top-buttons">
            <button className="button retake-button" onClick={handleRetake}>
              Retake
            </button>
            <button
              className="button upload-button"
              onClick={handleRecordedVideoUpload}
            >
              Upload to Drive
            </button>
          </div>

          <div className="video-preview">
            {/* Display the recorded video */}
            <video src={videoUrl} controls className="video-element" />
            <h2>Video Recorded Successfully!</h2>
          </div>

          <div className="submit-buttons">
            <button className="button trim-button" onClick={handleTrim}>
              Trim Video
            </button>
            <button className="button submit-button" onClick={handleSubmit}>
              Submit Video
            </button>
          </div>

          {showTrimModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeTrimModal}>
                  &times;
                </span>
                <h3>Trim Video</h3>
                <div className="trim-inputs">
                  <div className="input-group">
                    <label>Start time</label>
                    <input
                      type="text"
                      placeholder="mm:ss"
                      defaultValue="00:00"
                    />
                  </div>
                  <div className="input-group">
                    <label>End Time</label>
                    <input
                      type="text"
                      placeholder="mm:ss"
                      defaultValue="00:10"
                    />
                  </div>
                </div>
                <button className="trim-submit-button" onClick={trimVideo}>
                  Trim
                </button>
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
