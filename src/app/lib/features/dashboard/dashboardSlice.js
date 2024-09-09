import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  userEmail: "",
  userLimit: null,
  userSubscription: null,
  isdetailsOpen: false,
  pdfName: "",
  firstPdfName: "",
  pdfSlug: "",
  firstPdfSlug: "",
  pdfSummary: "",
  isUploadOpen: false,
  showOverlay: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setUserLimit: (state, action) => {
      state.userLimit = action.payload;
    },
    setUserSubscription: (state, action) => {
      state.userSubscription = action.payload;
    },
    setPdfName: (state, action) => {
      state.pdfName = action.payload;
    },
    setPdfSlug: (state, action) => {
      state.pdfSlug = action.payload;
    },
    setFirstPdfSlug: (state, action) => {
      state.firstPdfSlug = action.payload;
    },
    setFirstPdfName: (state, action) => {
      state.firstPdfName = action.payload;
    },
    setPdfSummary: (state, action) => {
      state.pdfSummary = action.payload;
    },
    toggleDetails: (state, action) => {
      state.isdetailsOpen = !state.isdetailsOpen;
      state.showOverlay = !state.showOverlay;
    },
    closeDetails: (state, action) => {
      state.isdetailsOpen = false;
      state.showOverlay = false;
    },
    toggleUpload: (state, action) => {
      state.isUploadOpen = !state.isUploadOpen;
      state.showOverlay = !state.showOverlay;
    },
  },
});

// console.log(NavSlice);
export const {
  toggleDetails,
  closeDetails,
  setPdfName,
  toggleUpload,
  setFirstPdfName,
  setPdfSlug,
  setFirstPdfSlug,
  setPdfSummary,
  setUserName,
  setUserEmail,
  setUserLimit,
  setUserSubscription,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
