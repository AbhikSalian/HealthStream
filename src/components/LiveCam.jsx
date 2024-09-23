import Webcam from "react-webcam";
const LiveCam=({liveVideoRef})=>{
    return(
        <>
        <div style={{ marginTop: "20px" }}>
        <h2>Live cam</h2>
        {/* {isRecording && ( */}
        <Webcam
          ref={liveVideoRef}
          style={{ width: "500px", border: "1px solid black" }}
          autoPlay
          muted
          playsInline
        />
        {/* )} */}
      </div>
      </>
    )
}
export default LiveCam;