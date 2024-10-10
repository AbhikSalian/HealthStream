import React from "react";
import Header from "./Header";
const VideoSubmitted = () => {
  const style = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
      backgroundColor: "#f0f0f0",
    },
    message: {
      fontSize: "24px",
      color: "#4caf50",
      padding: "20px",
      borderRadius: "10px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <>
    <Header/>
    <div style={style.container}>
      <div style={style.message}>Video submitted successfully!</div>
    </div>
    </>
  );
};

export default VideoSubmitted;
