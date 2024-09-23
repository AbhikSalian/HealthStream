// src/auth.js
import { gapi } from "gapi-script";

export const initGoogleDriveAuth = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          clientId: "865521704134-opjvrih0mesfenvll0etrupc7janke08.apps.googleusercontent.com.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/drive.file", // Drive file scope
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          resolve(authInstance);
        })
        .catch((error) => {
          console.error("Error initializing Google API", error);
          reject(error);
        });
    });
  });
};

export const signInWithGoogle = () => {
  return initGoogleDriveAuth().then((authInstance) => {
    return authInstance.signIn().then((user) => {
      const accessToken = user.getAuthResponse().access_token;
      return accessToken;
    });
  });
};
