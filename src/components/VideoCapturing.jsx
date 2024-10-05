import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoCapturing.css";
import Webcam from "react-webcam";
import Logout from "./Logout";
import Header from "./Header";
const VideoCapturing = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleStartRecording = async () => {
    setFeedbackMessage("");
    setIsRecording(true);

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(userStream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setVideoUrl(videoUrl);
        chunks.current = [];

        // Navigate to /video-upload and pass the video URL as state
        navigate("/video-upload", { state: { videoUrl } });
      };

      mediaRecorderRef.current.start();
      setFeedbackMessage("Recording started...");
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setFeedbackMessage("Error accessing media devices.");
    }
  };

  const handleStopRecording = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the media recorder
      setIsRecording(false);

      // Stop the webcam stream to turn off the camera light
      const stream = webcamRef.current.video.srcObject; // Access the media stream from the webcam ref
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop all tracks (audio & video)
        webcamRef.current.video.srcObject = null; // Clear the stream reference
      }
    }
  };

  return (
    <div className="container">
      {/* <div className="header">
        <h1 className="headerTitle">HealthStream</h1>
        <Logout/>
      </div> */}
      <Header/>
      <div className="videoWrapper">
        <div className="videoPreview">
          {isRecording ? (
            <Webcam className="videoPreview" ref={webcamRef} />
          ) : videoUrl ? (
            <video src={videoUrl} controls className="videoPreview" />
          ) : (
            <p>No video recorded</p>
          )}
        </div>
        <p className="statusText">
          {isRecording ? "Recording in progress..." : feedbackMessage}
        </p>
        {!isRecording ? (
          <button className="startButton" onClick={handleStartRecording}>
            Start Capturing
          </button>
        ) : (
          <button className="stopButton" onClick={handleStopRecording}>
            Stop Capturing
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCapturing;
