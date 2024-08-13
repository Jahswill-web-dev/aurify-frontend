import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./features/nav/navSlice";

export const store = () => {
  return configureStore({
    reducer: {
      nav:navReducer
    },
  });
};
