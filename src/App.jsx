import VideoRecorder from "./components/VideoRecorder";
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Login from "./components/Login";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import { BrowserRouter,Route,useRoutes,Router} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import HealthStream from "./components/HealthStream";
import VideoCapture from "./components/VideoCapture";
import VideoCapturing from "./components/VideoCapturing";
import VideoUploadComponent from "./components/VideoUploadComponent";
const clientId =
  "865521704134-opjvrih0mesfenvll0etrupc7janke08.apps.googleusercontent.com";
function AppRoutes(){
    const routesArray=[
        {
            path:"*",
            element:<Login/>
            // element:<HealthStream/>
        },
        {
            path:"/",
            element:<Login/>
            // element: <HealthStream/>
        },
        {path:"/video-recorder",
            element:(
              <PrivateRoute> 
                <VideoRecorder />
              </PrivateRoute>
            )
        },
        {
          path:"/home",
          element:<HealthStream/>
        },
        {path:"/video-capture",
          element:<VideoCapture/>
        },
        {
          path:"/video-capturing",
          element:<VideoCapturing/>
        },
        {
          path:"/video-upload",
          element:<VideoUploadComponent/>
        }
    ];
    return useRoutes(routesArray);
}
const App = () => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "https://www.googleapis.com/auth/drive.file",
      });
    }
    gapi.load("client:auth2", start);
  },[]);
  useEffect(() => {
    if (import.meta.env.VITE_NODE_ENV === "development") {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args[0].includes("Cross-Origin-Opener-Policy")) return;
        originalConsoleError(...args);
      };
    }
  }, []);
  return(
    <BrowserRouter>
    <AppRoutes/>
    </BrowserRouter>
    
  );
};
export default App;
