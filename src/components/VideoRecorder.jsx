import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startRecording,
  stopRecording,
  setVideoUrl,
  resetStream,
} from "../redux/videoSlice";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import DriveUploader from "./DriveUploader";
import { logoutSuccess } from "../redux/authSlice";
import LiveCam from "./LiveCam";
import RecordedVid from "./RecordedVid";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

// Import new button components
import StartRecordingButton from "./StartRecordingButton";
import StopRecordingButton from "./StopRecordingButton";
import LogoutButton from "./LogoutButton";

const VideoRecorder = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { isRecording, videoUrl } = useSelector((state) => state.video);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);
  
  // State for loading indicator and feedback messages
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleStartRecording = async () => {
    if (!isRecording) {
      setLoading(true); // Show loading indicator
      setFeedbackMessage(""); // Reset feedback message

      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = userStream;

        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = userStream;
          liveVideoRef.current.play();
        }

        const mediaRecorder = new MediaRecorder(userStream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          chunks.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks.current, { type: "video/webm" });
          const videoUrl = URL.createObjectURL(blob);
          dispatch(setVideoUrl(videoUrl));
          chunks.current = [];
          setLoading(false); // Hide loading indicator
          setFeedbackMessage("Recording stopped and video is ready."); // Feedback message
        };

        mediaRecorder.start();

        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            handleStopRecording();
          }
        }, 10000);

        dispatch(startRecording());
        setFeedbackMessage("Recording started..."); // Feedback message
      } catch (err) {
        console.error("Error accessing media devices.", err);
        setLoading(false); // Hide loading indicator on error
        setFeedbackMessage("Error accessing media devices."); // Feedback message
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

  const onLogoutSuccess = async () => {
    try {
      if (isRecording) {
        handleStopRecording();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      dispatch(resetStream());
      googleLogout();
      dispatch(logoutSuccess());
      console.log("Logged out successfully");

      navigate("/"); 
    } catch (e) {
      console.log("Logout error", e);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        dispatch(resetStream());
      }
    };
  }, [dispatch]);

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">Video Recorder</h1>
      <div className="row">
        <div className="col-md-3">
          <div className="d-flex flex-column align-items-center">
            <button
              className="btn btn-success mb-3" // Increased margin-bottom
              onClick={handleStartRecording}
              disabled={isRecording || loading}
            >
              Start Recording
            </button>
            <button
              className="btn btn-danger mb-3" // Increased margin-bottom
              onClick={handleStopRecording}
              disabled={!isRecording}
            >
              Stop Recording
            </button>
            <DriveUploader />
            <button 
              className="btn btn-warning mb-3" // Increased margin-bottom
              onClick={onLogoutSuccess}>
              Logout
            </button>
            {loading && <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>}
            {feedbackMessage && <div className="alert alert-info mt-3">{feedbackMessage}</div>}
          </div>
        </div>
        <div className="col-md-9">
          <div className="video-container">
            {isRecording ? (
              <LiveCam liveVideoRef={liveVideoRef} />
            ) : (
              <RecordedVid videoUrl={videoUrl} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
