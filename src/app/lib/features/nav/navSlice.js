import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavOpen: false,
  navOverlay:false
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    toggleNav: (state, action) => {
      state.isNavOpen = !state.isNavOpen;
      state.navOverlay = !state.navOverlay;
    },
    closeNav: (state, action) => {
      state.isNavOpen = false;
      state.navOverlay = false;
    },
  },
});

// console.log(NavSlice);
export const { toggleNav, closeNav } = navSlice.actions;
export default navSlice.reducer;
