import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startRecording,
  stopRecording,
  setVideoUrl,
  resetStream,
} from "./redux/videoSlice";
import Webcam from "react-webcam";

const App = () => {
  const dispatch = useDispatch();
  const { isRecording, videoUrl } = useSelector((state) => state.video);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const liveVideoRef = useRef(null); // For live video feed
  const streamRef = useRef(null); // Store MediaStream here instead of Redux

  const handleStartRecording = async () => {
    if (!isRecording) {
      try {
        // Get access to the user's webcam and microphone
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = userStream; // Store stream in ref, not Redux

        // Set the live video feed in the video element
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = userStream;
          liveVideoRef.current.play(); // Ensure live video plays
        }

        const mediaRecorder = new MediaRecorder(userStream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          chunks.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks.current, { type: "video/webm" });
          const videoUrl = URL.createObjectURL(blob);
          dispatch(setVideoUrl(videoUrl)); // Store video URL in Redux
          chunks.current = []; // Clear chunks
        };

        mediaRecorder.start();

        // Automatically stop recording after 10 seconds
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            handleStopRecording();
          }
        }, 10000); // 10 seconds

        dispatch(startRecording()); // Update isRecording state in Redux
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
  };

  const handleStopRecording = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop recording
      streamRef.current.getTracks().forEach((track) => track.stop()); // Stop the camera
      dispatch(stopRecording()); // Update Redux
    }
  };

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop()); // Stop the camera
        dispatch(resetStream()); // Reset stream-related Redux state
      }
    };
  }, [dispatch]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Simple Video Recorder with Live Feed</h1>

      <div>
        <button onClick={handleStartRecording} disabled={isRecording}>
          Start
        </button>
        <button onClick={handleStopRecording} disabled={!isRecording}>
          Stop
        </button>
        <button disabled>Upload (Coming soon)</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Live Video Feed:</h2>
        <video
          ref={liveVideoRef}
          style={{ width: "300px", border: "1px solid black" }}
          autoPlay
          muted
          playsInline // Ensure video plays on mobile
        />

        <div style={{ marginTop: "20px" }}>
          {videoUrl && (
            <div>
              <h2>Recorded Video:</h2>
              <video src={videoUrl} controls style={{ width: "300px" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
