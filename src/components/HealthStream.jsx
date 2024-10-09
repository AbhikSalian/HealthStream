import React from 'react';
import './HealthStream.css'; 
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
const HealthStream = () => {
    const navigate=useNavigate();
    const handleRecord=()=>{
        navigate('/video-capture');
    }
  return (
    <div className="container">
      {/* <button className="logoutButton">Log out</button> */}
      <Logout/>
      <h1 className="title">Welcome to HealthStream</h1>
      <div className="buttonContainer">
        <button className="actionButton" onClick={()=>handleRecord()}>Record a video</button>
      </div>
      <p className="orText">or</p>
      <div className="buttonContainer">
      <button className="actionButton" onClick={() => navigate('/upload-options')}>
  Upload existing
</button>

      </div>
    </div>
  );
};

export default HealthStream;
