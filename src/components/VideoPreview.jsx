import React, { useEffect, useState, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Slider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  log: true,
  wasmOptions: {
    // Disable shared memory (no use of SharedArrayBuffer)
    useWasmThreads: false,
  },
});
const VideoPreview = ({ videoUrl }) => {
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10); // Default to 10 seconds for trim length
  const [trimmedUrl, setTrimmedUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const videoRef = useRef(null);
  const maxTrimDuration = 10;
  useEffect(() => {
    // Reset trimmed video URL and duration when a new video is selected
    setTrimmedUrl("");
    setDuration(0);
    setStart(0);
    setEnd(10); // Set to a default or reset value
    console.log("VideoUrl: ",videoUrl);
  }, [videoUrl]); // This runs whenever the videoUrl changes

  const loadVideoMetadata = () => {
    const video = videoRef.current;
    console.log("VideoRef: ", videoRef);
    if (video) {
      video.onloadedmetadata = () => {
        const videoDuration = video.duration;
        console.log("Duration:", videoDuration);

        if (videoDuration && !isNaN(videoDuration)) {
          setDuration(videoDuration);

          // Adjust the end point if the video is shorter than 10 seconds
          const endValue =
            videoDuration > maxTrimDuration ? maxTrimDuration : videoDuration;
          setEnd(endValue);
        } else {
          console.log("Unable to fetch video duration.");
        }
      };
    }
  };

  const handleTrim = async () => {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    setIsTrimming(true);

    // Load the video into FFmpeg
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));

    // Run the FFmpeg command to trim the video
    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-ss",
      String(start),
      "-to",
      String(end),
      "-c",
      "copy",
      "output.mp4"
    );

    // Read the output video and create a URL
    const data = ffmpeg.FS("readFile", "output.mp4");
    const trimmedBlob = new Blob([data.buffer], { type: "video/mp4" });
    const trimmedUrl = URL.createObjectURL(trimmedBlob);

    setTrimmedUrl(trimmedUrl);
    setIsTrimming(false);
  };

  return (
    <div className="video-preview">
      <video
        src={trimmedUrl || videoUrl}
        ref={videoRef}
        onLoadedMetadata={loadVideoMetadata}
        controls
        className="video-element"
      />
      <div style={{ marginTop: "20px" }}>
        <Slider
          min={0}
          max={duration}
          value={[start, end]}
          step={0.1}
          onInput={(value) => {
            setStart(value[0]);
            setEnd(value[1]);
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Start: {start.toFixed(2)}s</span>
          <span>End: {end.toFixed(2)}s</span>
        </div>
      </div>
      <button className="trim-btn" onClick={handleTrim}>
        <FontAwesomeIcon icon={faScissors} />
      </button>
    </div>
  );
};

export default VideoPreview;
