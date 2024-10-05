import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { stopRecording, resetStream } from "../redux/videoSlice";
import { logoutSuccess } from "../redux/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRecording } = useSelector((state) => state.video);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Check auth state
  const streamRef = useSelector((state) => state.video.streamRef);

  const handleStopRecording = () => {
    if (isRecording) {
      dispatch(stopRecording());
    }
    if (streamRef) {
      streamRef.getTracks().forEach((track) => track.stop());
    }
  };

  const onLogoutSuccess = async () => {
    try {
      handleStopRecording();
      dispatch(resetStream());
      googleLogout();
      dispatch(logoutSuccess());
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  // Use useEffect to watch for auth changes and navigate when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Navigate only when logged out
    }
  }, [isAuthenticated, navigate]);

  return (
    <button className="logoutButton" onClick={onLogoutSuccess}>
      Logout
    </button>
  );
};

export default Logout;
