import React, { useState } from "react";
import { useSelector } from "react-redux";
import { signInWithGoogle } from "./auth"; 

const DriveUploader = () => {
  const { videoUrl } = useSelector((state) => state.video);
  const [accessToken, setAccessToken] = useState("");

  const handleUpload = async () => {
    if (!videoUrl) {
      console.log("No video to upload");
      return;
    }

    const token = await signInWithGoogle();
    setAccessToken(token);

    const blob = fetch(videoUrl).then((res) => res.blob());

    blob.then((videoBlob) => {
      const file = new File([videoBlob], "recorded_video.webm", {
        type: "video/webm",
      });

      const metadata = {
        name: "recorded_video.webm",
        mimeType: "video/webm",
      };

      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append("file", file);

      fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({ Authorization: "Bearer " + token }),
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("File uploaded successfully", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    });
  };

  return (
    <button className="upload" onClick={handleUpload} disabled={!videoUrl}>
      Upload to Google Drive
    </button>
  );
};

export default DriveUploader;
