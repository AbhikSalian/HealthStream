import "../css/Header.css"; // Create a CSS file for styling
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { stopRecording, resetStream } from "../redux/videoSlice";
import { logoutSuccess } from "../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons"; // Import the back arrow icon
import { setVideoUrl } from "../redux/videoSlice";
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRecording } = useSelector((state) => state.video);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Navigate only when logged out
    }
  }, [isAuthenticated, navigate]);

  // Function to navigate back to the previous page
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <header className="header">

        <div className="back-btn">
          <button className="back-btn element" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="title-header element">HealthStream</div>
        <div className="element">
          <button className="logout-btn" onClick={onLogoutSuccess}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
