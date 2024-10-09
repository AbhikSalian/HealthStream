import React from 'react';
import '../css/VideoCapture.css'; 
import { useNavigate } from 'react-router-dom';
import Header from './Header';
const VideoCapture = () => {
const navigate=useNavigate();
const handleStart=()=>{
    navigate('/video-capturing');
}
  return (
    <div className="container">
      {/* <div className="header">
        <h1 className="headerTitle">HealthStream</h1>
        <button className="logoutButton">Log out</button>
      </div> */}
      <Header/>
      <h2 className="mainTitle" >Start Capturing the Video</h2>
      <button className="captureButton" onClick={()=>handleStart()}>Start Capturing</button>
    </div>
  );
};

export default VideoCapture;
