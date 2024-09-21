const RecordedVid = ({videoUrl}) => {
  return (
    <>
      <div style={{ marginTop: "20px" }}>
        {videoUrl && (
          <div>
            <h2>Recorded Video:</h2>
            <video src={videoUrl} controls style={{ width: "500px" }} />
          </div>
        )}
      </div>
    </>
  );
};
export default RecordedVid;
