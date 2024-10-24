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
  const [end, setEnd] = useState(1000); // Default to 10 seconds for trim length
  const [trimmedUrl, setTrimmedUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const videoRef = useRef(null);
  const messageRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const maxTrimDuration = 10;
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState("");

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

        // Get the current timestamp and format it as a filename
        const timestamp = Date.now(); // Get current timestamp in milliseconds
        const fileName = `${timestamp}.mp4`; // Generate dynamic filename

        // Create a new File object with the dynamic filename
        const file = new File([blob], fileName, { type: blob.type });
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

          const trimmedUrl = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
          );
          console.log("trimmedUrl: ", trimmedUrl);
          setTrimmedVideoUrl(trimmedUrl);

          // Only update the video source if videoRef.current exists
          if (videoRef.current) {
            videoRef.current.src = trimmedUrl;
            console.log("Video source updated successfully!");
          } else {
            console.error("videoRef is null, unable to set video source.");
          }

          // Dispatch the trimmed video URL to Redux after it's successfully created
          dispatch(setVideoUrl(trimmedUrl));
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
      setEnd(Math.min(1000, video.duration));
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
        <div className="slider-container">
          <Slider
            min={0}
            max={duration}
            value={[start, end]}
            step={0.1}
            onInput={handleSliderInput}
            className="slider"
          />
          <div className="time-labels">
            {" "}
            {/* Added wrapper for labels */}
            {duration > 0 && duration < 1000 ? (
              <>
                <span>Start: {start.toFixed(2)}s</span>
                <span>End: {end.toFixed(2)}s</span>
              </>
            ) : (
              <>
                <span>Start: --s</span>
                <span>End: --s</span>
              </>
            )}
          </div>
        </div>
      )}

      <button className="trim-btn" onClick={handleTrim}>
        {duration > 0 && duration < 1000 ? (
          <FontAwesomeIcon icon={faScissors} />
        ) : (
          <>Click to load video</>
        )}
      </button>
    </div>
  );
};

export default VideoPreview;
