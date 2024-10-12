import React from "react";
import "../css/HealthStream.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
const HealthStream = () => {
  const navigate = useNavigate();
  const handleRecord = () => {
    navigate("/video-capturing");
  };
  return (
    <>
      <Header />
      <div className="container-home">
        {/* <button className="logoutButton">Log out</button> */}
        <h1 className="title-home">Welcome to HealthStream</h1>
        <div className="buttonContainer">
          <button className="actionButton" onClick={() => handleRecord()}>
            Record a video
          </button>
        </div>
        <p className="orText">or</p>
        <div className="buttonContainer">
          <button
            className="actionButton"
            onClick={() => navigate("/upload-options")}
          >
            Upload a video
          </button>
        </div>
      </div>
    </>
  );
};

export default HealthStream;
