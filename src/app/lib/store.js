import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./features/nav/navSlice";
import dashboardReducer from "@/app/lib/features/dashboard/dashboardSlice"
export const store = () => {
  return configureStore({
    reducer: {
      nav:navReducer,
      dashboard:dashboardReducer,
    },
  });
};
