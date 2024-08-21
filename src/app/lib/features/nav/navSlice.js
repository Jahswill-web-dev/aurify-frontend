import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavOpen: false,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    toggleNav: (state, action) => {
      state.isNavOpen = !state.isNavOpen;
    },
    closeNav: (state, action) => {
      state.isNavOpen = false;
    },
  },
});

// console.log(NavSlice);
export const { toggleNav, closeNav } = navSlice.actions;
export default navSlice.reducer;
