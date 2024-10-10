import React, { useEffect, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util"; // Importing from the new package
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
const VideoPreview = ({ videoUrl }) => {
  const [ffmpeg] = useState(() => new FFmpeg());
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10); // Default to 10 seconds for trim length

  // Load FFmpeg on component mount
  useEffect(() => {
    const initFFmpeg = async () => {
      await ffmpeg.load();
    };

    initFFmpeg();
  }, [ffmpeg]);

  const handleTrim = async () => {
    // Fetch the original video as a Blob
    const videoBlob = await fetchFile(videoUrl);

    // Write the original video file to FFmpeg
    await ffmpeg.writeFile("input.mp4", videoBlob);

    // Trim the video using FFmpeg
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-ss", start.toString(),
      "-to", end.toString(),
      "-c", "copy",
      "output.mp4",
    ]);

    // Read the trimmed video file from FFmpeg
    const data = await ffmpeg.readFile("output.mp4");
    const trimmedVideoBlob = new Blob([data.buffer], { type: "video/mp4" });
    setTrimmedVideoUrl(URL.createObjectURL(trimmedVideoBlob));
    
    await ffmpeg.terminate();
  };

  // Set up the slider for trimming
  useEffect(() => {
    const slider = document.getElementById("trim-slider");
    noUiSlider.create(slider, {
      start: [start, end],
      range: {
        min: 0,
        max: 60, // Adjust this based on the actual length of the video
      },
      step: 1,
      connect: true,
    });

    slider.noUiSlider.on("update", (values) => {
      setStart(parseFloat(values[0]));
      setEnd(parseFloat(values[1]));
    });

    return () => {
      slider.noUiSlider.destroy();
    };
  }, []);

  return (
    <div className="video-preview">
      <video src={trimmedVideoUrl || videoUrl} controls className="video-element" />
      <div id="trim-slider"></div>
      <button className="trim-btn" onClick={handleTrim}><FontAwesomeIcon icon={faScissors} /></button>
    </div>
  );
};

export default VideoPreview;
