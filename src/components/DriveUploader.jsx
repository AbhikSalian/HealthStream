import React, { useState } from "react";
import { useSelector } from "react-redux";

const DriveUploader = () => {
  const { videoUrl } = useSelector((state) => state.video);
  const { token } = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to upload the recorded video
  const handleRecordedVideoUpload = async () => {
    if (!videoUrl) {
      console.log("No recorded video to upload");
      return;
    }

    try {
      const blob = await fetch(videoUrl).then((res) => res.blob());
      const file = new File([blob], "recorded_video.webm", {
        type: "video/webm",
      });

      await uploadFileToDrive(file, "recorded_video.webm");
    } catch (error) {
      console.error("Error uploading recorded video:", error);
    }
  };

  // Function to handle file selection from local storage
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Function to upload the selected file from device
  const handleSelectedFileUpload = async () => {
    if (!selectedFile) {
      console.log("No file selected to upload");
      return;
    }

    try {
      await uploadFileToDrive(selectedFile, selectedFile.name);
    } catch (error) {
      console.error("Error uploading file from device:", error);
    }
  };

  // Common function to upload file to Google Drive
  const uploadFileToDrive = async (file, fileName) => {
    const metadata = {
      name: fileName,
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
  };

  return (
    <div>
      {/* Button to upload the recorded video */}
      <button className="upload" onClick={handleRecordedVideoUpload} disabled={!videoUrl}>
        Upload Recorded Video
      </button>

      {/* File input for selecting file from local storage */}
      <input
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
      />

      {/* Button to upload the selected file */}
      <button className="upload" onClick={handleSelectedFileUpload} disabled={!selectedFile}>
        Upload Video from Device
      </button>
    </div>
  );
};

export default DriveUploader;
