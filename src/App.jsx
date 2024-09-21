import VideoRecorder from "./components/VideoRecorder";
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Login from "./components/Login";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import { BrowserRouter,Route,useRoutes,Router} from "react-router-dom";
const clientId =
  "943789416233-fv88mhvef702gb1pggc1s9ig9khk6bdu.apps.googleusercontent.com";
function AppRoutes(){
    const routesArray=[
        {
            path:"*",
            element:<Login/>
        },
        {path:"/video-recorder",
            element:<VideoRecorder/>
        }
    ];
    return useRoutes(routesArray);
}
const App = () => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  });
  return(
    <BrowserRouter>
    <AppRoutes/>
    </BrowserRouter>
  );
};
export default App;
