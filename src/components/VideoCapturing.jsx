import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/VideoCapturing.css";
import Webcam from "react-webcam";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
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
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cleanup function to stop the webcam when unmounting
  useEffect(() => {
    return () => {
      const stream = webcamRef.current?.video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Stop each track
        webcamRef.current.video.srcObject = null; // Clear the source object
        console.log("Webcam stopped");
      }
    };
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="videoWrapper">
        <div className={`videoPreview ${isRecording ? "white" : "black"}`}>
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
            Start Recording <FontAwesomeIcon icon={faRecordVinyl} />
          </button>
        ) : (
          <button className="stopButton" onClick={handleStopRecording}>
            Stop Recording <FontAwesomeIcon icon={faStop} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCapturing;
