import React, { useEffect, useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import Slider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { setVideoUrl } from "../redux/videoSlice";
const VideoPreview = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const { videoUrl } = useSelector((state) => state.video);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10); // Default to 10 seconds for trim length
  const [trimmedUrl, setTrimmedUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const videoRef = useRef(null);
  const messageRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const maxTrimDuration = 10;

  // useEffect(() => {
  //   // Reset trimmed video URL and duration when a new video is selected
  //   setTrimmedUrl("");
  //   setDuration(0);
  //   setStart(0);
  //   setEnd(10); // Set to a default or reset value
  //   console.log("VideoUrl: ",videoUrl);
  // }, [videoUrl]); // This runs whenever the videoUrl changes

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on("log", ({ message }) => {
          // messageRef.current.innerHTML = message;
          console.log(message);
        });

        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });

        setLoaded(true);
      } catch (error) {
        console.error("Error loading FFmpeg:", error);
      }
    };

    loadFFmpeg();
  }, []);

  useEffect(() => {
    // When videoUrl is provided, convert it into a file-like Blob and set it as selectedFile
    const fetchVideoFileFromUrl = async () => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const file = new File([blob], "video.mp4", { type: blob.type });
        setSelectedFile(file);
      } catch (error) {
        console.error("Error fetching video file from URL:", error);
      }
    };

    if (videoUrl) {
      fetchVideoFileFromUrl();
    }
  }, [videoUrl]);

  const toBlobURL = async (url, type) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(new Blob([blob], { type }));
    } catch (error) {
      console.error("Error in toBlobURL while fetching:", url, error);
    }
  };

  const handleTrim = async () => {
    try {
      const ffmpeg = ffmpegRef.current;

      if (!selectedFile) {
        console.error("No file selected!");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const inputVideo = new Uint8Array(event.target.result);
        await ffmpeg.writeFile("input.webm", inputVideo);

        await ffmpeg.exec([
          "-i",
          "input.webm",
          "-ss",
          start.toFixed(2),
          "-to",
          end.toFixed(2),
          "-c",
          "copy",
          "output.mp4",
        ]);
        const data = await ffmpeg.readFile("output.mp4");
        if (data.length > 0) {
          console.log("Output video segment successfully read!");
          videoRef.current.src = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
          );
          console.log("Video source updated successfully!");
        } else {
          console.error("Failed to read output data from FFmpeg!");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
      setIsTrimming(true);
      setStart(0);
    } catch (error) {
      console.error("Error during transcoding:", error);
    }
  };
  const handleDurationChange = (event) => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setEnd(Math.min(10, video.duration));
    }
  };

  const handleSliderInput = (values) => {
    const [newStart, newEnd] = values;
    const maxDifference = 10;

    if (newEnd - newStart >= maxDifference) {
      setStart(newEnd - maxDifference);
      setEnd(newEnd);
    } else {
      if (newEnd - newStart > maxDifference) {
        setEnd(newStart + maxDifference);
      } else if (newStart < start) {
        setEnd(newStart + maxDifference);
      }
      setStart(newStart);
      setEnd(newEnd);
    }
  };

  return (
    <div className="video-preview">
      <video
        src={videoUrl}
        ref={videoRef}
        onLoadedMetadata={handleDurationChange}
        controls
        className="video-element"
      />
      {duration > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Slider
            min={0}
            max={duration}
            value={[start, end]}
            step={0.1}
            onInput={handleSliderInput}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Start: {start.toFixed(2)}s</span>
            <span>End: {end.toFixed(2)}s</span>
          </div>
        </div>
      )}
      <button className="trim-btn" onClick={handleTrim}>
        <FontAwesomeIcon icon={faScissors} />
      </button>
    </div>
  );
};

export default VideoPreview;
