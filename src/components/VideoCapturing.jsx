import React from "react";
import "./VideoCapturing.css";
import Webcam from "react-webcam";
const VideoCapturing = () => {
  return (
    <div className="container">
      <div className="header">
        <h1 className="headerTitle">HealthStream</h1>
        <button className="logoutButton">Log out</button>
      </div>
      <div className="videoWrapper">
        <div className="videoPreview">
          <Webcam className="videoPreview"/>
        </div>
        <p className="statusText">Recording in progress...</p>
        <button className="stopButton">Stop Capturing</button>
      </div>
    </div>
  );
};

export default VideoCapturing;
