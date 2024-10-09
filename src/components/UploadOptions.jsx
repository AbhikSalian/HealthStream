import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import CalendarUpload from "./CalendarUpload";
import './UploadOptions.css';
// Component to handle the video upload logic
const UploadOptions = () => {
  const [videoFile, setVideoFile] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadDateTime, setUploadDateTime] = useState(null); // State for calendar

  const FOLDER_NAME = "video-recorder-uploads";

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
    } catch (error) {
      console.error("Error uploading file to Drive:", error);
    }
  };

  // Handle file selection from device
  const handleDeviceUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSelectedFileUpload = async () => {
    if (!videoFile) {
      console.log("No file selected to upload");
      return;
    }
    try {
      await uploadFileToDrive(videoFile, videoFile.name);
    } catch (error) {
      console.error("Error uploading file from device:", error);
    }
  };

  // Simulate file selection from Google Drive
  const handleDriveUpload = () => {
    console.log("GDrive clicked");
  };

  return (
    <>
      <Header />
    <div className="upload-options-container">
      <div className="button-container">
        <button
          className="upload-button"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Upload from Device
        </button>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept="video/*"
          onChange={handleDeviceUpload}
        />
        <button className="upload-button" onClick={handleDriveUpload}>
          Upload from Google Drive
        </button>
      </div>
      <div className="info-container">
        <p>Selected Video: {videoFile ? videoFile.name : "No file selected"}</p>
        <button className="submit-button" onClick={handleSelectedFileUpload}>
          Upload to Google Drive
        </button>
        <button className="submit-button">Submit</button>{" "}
        {/* Dummy button for now */}
      </div>
      {uploadedFileName && uploadDateTime && (
        <CalendarUpload
          fileName={uploadedFileName}
          uploadDateTime={uploadDateTime}
        />
      )}
    </div>
    </>
  );
};

export default UploadOptions;
