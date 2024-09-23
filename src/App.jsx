import VideoRecorder from "./components/VideoRecorder";
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Login from "./components/Login";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import { BrowserRouter,Route,useRoutes,Router} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
const clientId =
  "865521704134-opjvrih0mesfenvll0etrupc7janke08.apps.googleusercontent.com";
function AppRoutes(){
    const routesArray=[
        {
            path:"*",
            element:<Login/>
        },
        {
            path:"/",
            element:<Login/>
        },
        {path:"/video-recorder",
            element:(
              <PrivateRoute> {/* Protect the route */}
                <VideoRecorder />
              </PrivateRoute>
            )
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
  return(
    <BrowserRouter>
    <AppRoutes/>
    </BrowserRouter>
  );
};
export default App;
