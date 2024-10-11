import React, { useEffect, useState ,useRef} from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util"; // Importing from the new package
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
let ffmpeg;
const VideoPreview = ({ videoUrl }) => {
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState("");
  const [videoDuration, setVideoDuration]=useState(0);
  const [endTime, setEndTime]=useState(0);
  const [startTime, setStartTime]=useState(0);
  const [videoSrc,setVideoSrc]=useState("");
  const [videoFileValue,setVideoFileValue]=useState("");
  const [isScriptLoaded,setIsScriptLoaded]=useState(false);
  const [videoTrimmedUrl,setVideoTrimmedUrl]=useState("");
  const videRef=useRef();
  let initialSliderValue=0;
  const loadScript = (src) => {
    return new Promise((onFulfilled, _) => {
      const script = document.createElement("script");
      let loaded;
      script.async = "async";
      script.defer = "defer";
      script.setAttribute("src", src);
      script.onreadystatechange = script.onload = () => {
        if (!loaded) {
          onFulfilled(script);
        }
        loaded = true;
      };
      script.onerror = function () {
        console.log("script failed to load");
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  };
  const handleTrim = async () => {};

  // Set up the slider for trimming
  useEffect(() => {
    loadScript(
      "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js"
    ).then(() => {
      if (typeof window !== "undefined") {
        ffmpeg=window.FFmpeg.createFFmpeg({log:true});
        console.log(ffmpeg);
        ffmpeg.load();
        setIsScriptLoaded(true);
      }
    });
  }, []);

  return (
    <div className="video-preview">
      <video
        src={trimmedVideoUrl || videoUrl}
        controls
        className="video-element"
      />
      <div id="trim-slider"></div>
      <button className="trim-btn" onClick={handleTrim}>
        <FontAwesomeIcon icon={faScissors} />
      </button>
    </div>
  );
};

export default VideoPreview;
