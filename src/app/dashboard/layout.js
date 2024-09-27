"use client";
import DashboardNav from "./_components/dashboardNav";
import SideNav from "./_components/sideNav";
import { MobileDetails } from "../dashboard/_components/details";
import Upload from "./_components/upload";
import { useDispatch, useSelector } from "react-redux";
import { LoginPopUp } from "./_components/loginPopUp";
import { useFetchWithToken } from "../hooks/useCustomHook";
import { useEffect } from "react";
import {
  setUserEmail,
  setUserLimit,
  setUserName,
  setUserSubscription,
} from "../lib/features/dashboard/dashboardSlice";
import Loading from "./_components/loading";

function DashboardLayout({ children }) {
  const { showOverlay } = useSelector((store) => store.dashboard);
  const { navOverlay } = useSelector((store) => store.nav);
  const isOverlayVisible = showOverlay || navOverlay;
  // console.log(navOverlay);
  const dispatch = useDispatch();
  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/me`
  );
  useEffect(() => {
    if (data && !error && !loading) {
      // console.log(data.data);
      dispatch(setUserName(data.data.username));
      dispatch(setUserEmail(data.data.email));
      dispatch(setUserLimit(data.data.limit));
      dispatch(setUserSubscription(data.data.is_pro));
    }
  }, [data, error, loading, dispatch]);
  // console.log(error?.response?.status);
  if (error?.response?.status === 403) {
    return <LoginPopUp />;
  }
  if (error?.response?.status === 401) {
    return <LoginPopUp />;
  }
  if (loading) return <Loading />;
  if (error)
    return <p className="text-center text-3xl mt-28">Error: {error.message}</p>;

  return (
    <div className="max-w-[1557px] mx-auto">
      <DashboardNav />
      <div className="flex flex-col md:flex-row py-5 mt-5 gap-2 md:pr-2">
        <SideNav />
        {children}
      </div>
      <MobileDetails />
      <Upload />
      {/* <DeleteBox/> */}
      {/* dark overlay */}
      {isOverlayVisible && (
        <div className="h-screen fixed top-0 bottom-0 right-0 left-0 bg-black opacity-20 z-10"></div>
      )}
    </div>
  );
}

export default DashboardLayout;
