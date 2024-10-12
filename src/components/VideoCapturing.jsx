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
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
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
          // liveVideoRef.current.play();
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
    }
  };

  // Cleanup function to stop the webcam when unmounting
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        dispatch(resetStream());
      }
    };
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="container">
        <div className="videoWrapper">
          <div className={`videoPreview ${isRecording ? "white" : "black"}`}>
            {isRecording ? (
              // <Webcam className="videoPreview" ref={webcamRef} />
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
            {isRecording ? "Recording in progress..." : feedbackMessage}
          </p>
          {!isRecording ? (
            <button
              className="startButton"
              onClick={() => handleStartRecording()}
            >
              Start Recording <FontAwesomeIcon icon={faRecordVinyl} />
            </button>
          ) : (
            <button
              className="stopButton"
              onClick={() => handleStopRecording()}
            >
              Stop Recording <FontAwesomeIcon icon={faStop} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoCapturing;
