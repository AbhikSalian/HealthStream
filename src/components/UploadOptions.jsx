import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import CalendarUpload from "./CalendarUpload";
import VideoPreview from "./VideoPreview";
import "../css/UploadOptions.css";
import useDrivePicker from "react-google-drive-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const UploadOptions = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadDateTime, setUploadDateTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [uploadMessage, setUploadMessage] = useState(""); // State for upload message
  const [openPicker, authResponse] = useDrivePicker();
  const FOLDER_NAME = "video-recorder-uploads";
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const apiKey = import.meta.env.VITE_DEVELOPER_KEY;
const navigate=useNavigate();
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
    setIsLoading(true); // Start loading
    setUploadMessage(""); // Clear previous message
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

      setUploadMessage("File uploaded and event created successfully"); // Set success message
      setVideoFile(null);
    } catch (error) {
      console.error("Error uploading file to Drive:", error);
      setUploadMessage("Error uploading file."); // Set error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleDeviceUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
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

  const handleDriveUpload = () => {
    console.log("GDrive clicked");
    openPicker({
      clientId: clientId,
      developerKey: apiKey,
      viewId: "DOCS_VIDEOS",
      token: token,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false, // Limit to one file for simplicity
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
          return;
        }

        if (data.docs && data.docs.length > 0) {
          const fileId = data.docs[0].id; // Get the selected file ID
          const fileName = data.docs[0].name; // Get the selected file name
          console.log(`File selected: ${fileName} (ID: ${fileId})`);

          // Now fetch the file from Google Drive using the file ID
          fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
              method: "GET",
              headers: new Headers({
                Authorization: "Bearer " + token,
              }),
            }
          )
            .then((response) => response.blob())
            .then((blob) => {
              // Create a File object from the Blob
              const file = new File([blob], fileName, { type: blob.type });
              setVideoFile(file); // Set the selected file
              const videoUrl = URL.createObjectURL(blob);
              setVideoPreview(videoUrl);
              console.log("File fetched and set:", file);
            })
            .catch((error) =>
              console.error("Error fetching file from Drive:", error)
            );
        }
      },
    });
  };
const handleSubmit=()=>{
navigate('/video-submitted');
}
  return (
    <>
      <Header />
      <div className="upload-options-container">
          <h3>Upload</h3>
        <div className="button-container">
          <button
            className="upload-button"
            onClick={() => document.getElementById("fileInput").click()}
          >
            From <FontAwesomeIcon icon={faLaptop} />
          </button>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept="video/*"
            onChange={handleDeviceUpload}
          />
          <button className="upload-button" onClick={handleDriveUpload}>
            From <FontAwesomeIcon icon={faGoogleDrive} />
          </button>
        </div>
        <div className="info-container">
          {videoPreview ? ( // Use VideoPreview component
            <>
              <VideoPreview videoUrl={videoPreview} />
              {isLoading && <p className="success-message">Uploading file... Please wait.</p>}
                {uploadMessage && <p className="success-message">{uploadMessage}</p>}
              <button
                className="submit-button"
                onClick={handleSelectedFileUpload}
              >
                
                Upload to <FontAwesomeIcon icon={faGoogleDrive} />
              </button>
              <button className="submit-button" onClick={handleSubmit}><FontAwesomeIcon icon={faCheck} /></button>
            </>
          ) : (
            <p className="success-message">No video selected</p>
          )}
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
