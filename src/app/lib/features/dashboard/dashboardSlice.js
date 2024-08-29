import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isdetailsOpen: false,
  pdfName:'',
  firstPdfName:'',
  isUploadOpen:false,
  showOverlay:false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setPdfName:(state, action)=>{
        state.pdfName = action.payload;
    },
    setFirstPdfName:(state, action)=>{
        state.firstPdfName = action.payload;
    },
    toggleDetails: (state, action) => {
      state.isdetailsOpen = !state.isdetailsOpen;
      state.showOverlay = !state.showOverlay;
    },
    closeDetails: (state, action) => {
      state.isdetailsOpen = false;
      state.showOverlay = false;
    },
    toggleUpload:(state, action)=>{
        state.isUploadOpen = !state.isUploadOpen;
        state.showOverlay = !state.showOverlay;
    }
  },
});

// console.log(NavSlice);
export const { toggleDetails, closeDetails, setPdfName, toggleUpload, setFirstPdfName } = dashboardSlice.actions;
export default dashboardSlice.reducer;
