import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isdetailsOpen: false,
  pdfName:'',
  isUploadOpen:false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setPdfName:(state, action)=>{
        state.pdfName = action.payload;
    },
    toggleDetails: (state, action) => {
      state.isdetailsOpen = !state.isdetailsOpen;
    },
    closeDetails: (state, action) => {
      state.isdetailsOpen = false;
    },
    toggleUpload:(state, action)=>{
        state.isUploadOpen = !state.isUploadOpen;
    }
  },
});

// console.log(NavSlice);
export const { toggleDetails, closeDetails, setPdfName, toggleUpload } = dashboardSlice.actions;
export default dashboardSlice.reducer;
