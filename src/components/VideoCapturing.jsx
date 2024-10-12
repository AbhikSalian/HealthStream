import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  startRecording,
  stopRecording,
  setVideoUrl,
  resetStream,
} from "../redux/videoSlice";
import "../css/VideoCapturing.css";
import Webcam from "react-webcam";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecordVinyl, faStop } from "@fortawesome/free-solid-svg-icons";

const VideoCapturing = () => {
  const dispatch = useDispatch();
  const { isRecording, videoUrl } = useSelector((state) => state.video);
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const streamRef = useRef(null);
  const liveVideoRef = useRef(null);

  // New state to track recording time
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const handleStartRecording = async () => {
    if (!isRecording) {
      setFeedbackMessage("");
      dispatch(startRecording());

      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = userStream;
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = userStream;
        }

        mediaRecorderRef.current = new MediaRecorder(userStream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks.current, { type: "video/webm" });
          const videoUrll = URL.createObjectURL(blob);
          dispatch(setVideoUrl(videoUrll));
          chunks.current = [];

          navigate("/video-upload");
        };

        mediaRecorderRef.current.start();
        dispatch(startRecording());

        setFeedbackMessage("Recording started...");

        // Start the timer for recording time
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setFeedbackMessage("Error accessing media devices.");
      }
    }
  };

  const handleStopRecording = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
      dispatch(stopRecording());

      // Stop and reset the timer
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  // Cleanup function to stop the webcam when unmounting
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        dispatch(resetStream());
      }
      clearInterval(timerRef.current);
    };
  }, [dispatch]);

  // Convert recording time to minutes and seconds
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="videoWrapper">
          <div className={`videoPreview ${isRecording ? "white" : "black"}`}>
            {isRecording ? (
              <Webcam
                ref={liveVideoRef}
                className="videoPreview"
                autoPlay
                muted
                playsInline
              />
            ) : videoUrl ? (
              <video src={videoUrl} controls className="videoPreview" />
            ) : (
              <p>No video recorded</p>
            )}
          </div>
          <p className="statusText">
            {isRecording
              ? `Recording in progress... ${formatTime(recordingTime)}`
              : feedbackMessage}
          </p>
          {!isRecording ? (
            <button
              className="startButton"
              onClick={() => handleStartRecording()}
            >
              Start Recording <FontAwesomeIcon icon={faRecordVinyl} />
            </button>
          ) : (
            <button className="stopButton" onClick={() => handleStopRecording()}>
              Stop Recording <FontAwesomeIcon icon={faStop} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoCapturing;
