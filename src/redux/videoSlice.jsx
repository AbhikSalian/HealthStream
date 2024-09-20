import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRecording: false,
  videoUrl: null,
  stream: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    startRecording: (state, action) => {
      state.isRecording = true;
    //   state.stream = action.payload;
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    setVideoUrl: (state, action) => {
      state.videoUrl = action.payload;
    },
    // resetStream: (state) => {
    //   state.stream = null;
    // },
  },
});

export const { startRecording, stopRecording, setVideoUrl, resetStream } = videoSlice.actions;

export default videoSlice.reducer;
