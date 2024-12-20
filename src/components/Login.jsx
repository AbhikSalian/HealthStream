import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import '../css/Login.css';
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Suppress specific console errors in development
  // useEffect(() => {
  //   if (import.meta.env.VITE_NODE_ENV === "development") {
  //     const originalConsoleError = console.error;
  //     console.error = (...args) => {
  //       if (args[0].includes("Cross-Origin-Opener-Policy")) return;
  //       originalConsoleError(...args);
  //     };
  //   }
  // }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("OAuth Token: ", tokenResponse.access_token);

      dispatch(
        loginSuccess({
          token: tokenResponse.access_token, // OAuth access token
        })
      );

      navigate("/home");
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
    scope:
      "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar.events", // Drive and Calendar scopes
  });

  return (
    <div id="signInButton">
      <button className="signInButton" onClick={() => login()}>Sign in with <FontAwesomeIcon icon={faGoogle} /></button>
    </div>
  );
}

export default Login;
