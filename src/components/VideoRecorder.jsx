import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startRecording,
  stopRecording,
  setVideoUrl,
  resetStream,
} from "../redux/videoSlice";
import "../App.css";
import LiveCam from "./LiveCam";
import RecordedVid from "./RecordedVid";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import DriveUploader from "./DriveUploader";
const VideoRecorder = () => {
  const navigate = useNavigate(); 

  const dispatch = useDispatch();
  const { isRecording, videoUrl } = useSelector((state) => state.video);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);

  const handleStartRecording = async () => {
    if (!isRecording) {
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
        };

        mediaRecorder.start();

        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            handleStopRecording();
          }
        }, 10000);

        dispatch(startRecording());
      } catch (err) {
        console.error("Error accessing media devices.", err);
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Video Recorder</h1>

      <div>
        <button
          className="start"
          onClick={handleStartRecording}
          disabled={isRecording}
        >
          Start
        </button>
        <button
          className="stop"
          onClick={handleStopRecording}
          disabled={!isRecording}
        >
          Stop
        </button>
        <DriveUploader/>
      <button onClick={onLogoutSuccess}>Logout</button>

      </div>

      {isRecording ? (
        <LiveCam liveVideoRef={liveVideoRef} />
      ) : (
        <RecordedVid videoUrl={videoUrl} />
      )}
    </div>
  );
};

export default VideoRecorder;
