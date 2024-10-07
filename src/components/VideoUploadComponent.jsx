import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoActions from "./VideoActions";
import VideoPreview from "./VideoPreview";
import TrimModal from "./TrimModal";
import VideoUploadHandler from "./VideoUploadHandler";
import CalendarUpload from "./CalendarUpload"; 
import Header from "./Header";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"; // Import ffmpeg

const ffmpeg = createFFmpeg({ log: true });

const VideoUploadComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoUrl } = location.state || {};
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [uploadDateTime, setUploadDateTime] = useState(null); 
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState(videoUrl); // State for trimmed video

  const { handleRecordedVideoUpload } = VideoUploadHandler({
    videoUrl: trimmedVideoUrl, // Use trimmed video URL for upload
    onUploadSuccess: (fileName) => {
      setUploadedFileName(fileName);
      setUploadDateTime(new Date().toISOString());
    },
  });

  const handleRetake = () => {
    navigate("/video-capturing");
  };

  const handleTrim = () => setShowTrimModal(true);
  const closeTrimModal = () => setShowTrimModal(false);

  const trimVideo = async (start, end) => {
    if (!videoUrl) return;

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const fileName = "input.webm";
    ffmpeg.FS("writeFile", fileName, await fetchFile(videoUrl));

    await ffmpeg.run("trim", fileName, start, end, "output.webm");

    const data = ffmpeg.FS("readFile", "output.webm");

    const newVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: "video/webm" }));
    setTrimmedVideoUrl(newVideoUrl); // Set the new trimmed video URL
    closeTrimModal();
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
      {trimmedVideoUrl ? ( // Use trimmed video URL
        <>
          <VideoActions onRetake={handleRetake} onUpload={handleRecordedVideoUpload} />
          <VideoPreview videoUrl={trimmedVideoUrl} /> {/* Display trimmed video */}
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
