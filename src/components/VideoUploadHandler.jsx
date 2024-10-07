import { useSelector } from "react-redux";

const VideoUploadHandler = ({ videoUrl, onUploadSuccess }) => {
  const FOLDER_NAME = "video-recorder-uploads";
  const { token } = useSelector((state) => state.auth);

  const getOrCreateFolder = async () => {
    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`,
        {
          method: "GET",
          headers: new Headers({ Authorization: "Bearer " + token }),
        }
      );
      const searchData = await searchResponse.json();
      if (searchData.files && searchData.files.length > 0) {
        return searchData.files[0].id;
      }
      const metadata = { name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" };
      const createResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(metadata),
      });
      const createData = await createResponse.json();
      return createData.id;
    } catch (error) {
      console.error("Error in creating or fetching folder:", error);
    }
  };

  const uploadFileToDrive = async (file, fileName) => {
    try {
      const folderId = await getOrCreateFolder();
      const metadata = { name: fileName, parents: [folderId], mimeType: file.type };
      const formData = new FormData();
      formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      formData.append("file", file);

      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: new Headers({ Authorization: "Bearer " + token }),
        body: formData,
      });
      const data = await response.json();
      console.log("File uploaded successfully", data);

      onUploadSuccess(fileName);
    } catch (error) {
      console.error("Error uploading file to Drive:", error);
    }
  };

  const handleRecordedVideoUpload = async () => {
    if (!videoUrl) {
      console.log("No recorded video to upload");
      return;
    }
    try {
      const blob = await fetch(videoUrl).then((res) => res.blob());
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `video-${timestamp}.webm`;
      const file = new File([blob], fileName, { type: "video/webm" });
      await uploadFileToDrive(file, fileName);
    } catch (error) {
      console.error("Error uploading recorded video:", error);
    }
  };

  return { handleRecordedVideoUpload };
};

export default VideoUploadHandler;
