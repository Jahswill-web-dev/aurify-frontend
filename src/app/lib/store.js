import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./features/nav/navSlice";
import dashboardReducer from "@/app/lib/features/dashboard/dashboardSlice"
import authslice from "@/app/lib/features/auth/authSlice";
export const store = () => {
  return configureStore({
    reducer: {
      nav:navReducer,
      dashboard:dashboardReducer,
      auth:authslice,
    },
  });
};
