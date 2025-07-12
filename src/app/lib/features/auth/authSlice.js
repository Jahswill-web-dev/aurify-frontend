import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  authMode:null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      
    },
    clearAccessToken: (state, action) => {
      state.accessToken = null;
    },
    setAuthMode: (state, action) => {
      state.authMode = action.payload;
    },
  },
});

export const { setAccessToken, clearAccessToken, setAuthMode } = authSlice.actions;
export default authSlice.reducer;
