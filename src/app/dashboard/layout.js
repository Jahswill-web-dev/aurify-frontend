"use client";
import DashboardNav from "./_components/dashboardNav";
import SideNav from "./_components/sideNav";
import { MobileDetails } from "../dashboard/_components/details";
import Upload from "./_components/upload";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setUserEmail,
  setUserLimit,
  setUserName,
  setUserSubscription,
} from "../lib/features/dashboard/dashboardSlice";
import AudioControlls from "./_components/audioControlls";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import { hasAccessToken } from "../lib/aurifyApi";

function DashboardLayout({ children }) {
  const { showOverlay } = useSelector((store) => store.dashboard);
  const { navOverlay } = useSelector((store) => store.nav);
  const isOverlayVisible = showOverlay || navOverlay;
  // console.log(navOverlay);
  const dispatch = useDispatch();
  const [hasSession, setHasSession] = useState(null);

  useEffect(() => {
    const nextHasSession = hasAccessToken();
    setHasSession(nextHasSession);
    if (!nextHasSession) return;

    // UI preview mode: keep dashboard routes accessible while the backend auth
    // flow is paused. Re-enable the /me request below when reconnecting auth.
    dispatch(setUserName("Designer"));
    dispatch(setUserEmail("designer@aurify.local"));
    dispatch(setUserLimit(0));
    dispatch(setUserSubscription(false));
  }, [dispatch]);

  // const { data, error, loading } = useFetchWithToken(
  //   `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/me`
  // );
  //
  // useEffect(() => {
  //   if (data && !error && !loading) {
  //     dispatch(setUserName(data.data.username));
  //     dispatch(setUserEmail(data.data.email));
  //     dispatch(setUserLimit(data.data.limit));
  //     dispatch(setUserSubscription(data.data.is_pro));
  //   }
  // }, [data, error, loading, dispatch]);
  //
  // if (error?.response?.status === 403) {
  //   return <LoginPopUp />;
  // }
  // if (error?.response?.status === 401) {
  //   return <LoginPopUp />;
  // }
  // if (loading) return <Loading />;
  // if (error)
  //   return <p className="text-center text-3xl mt-28">Error: {error.message}</p>;
  if (hasSession === null) {
    return (
      <main className="min-h-screen bg-off-white-100 px-4 py-10 dark:bg-dark-bg">
        <div className="mx-auto max-w-[640px] rounded-md border border-grey-25 bg-white p-8 text-center shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
          <p className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  if (!hasSession) {
    return (
      <AuthRequiredState
        title="Log in to open your Dashboard"
        message="Your dashboard contains private study activity, uploads, scores, and account details."
        secondaryHref="/"
        secondaryLabel="Back to Home"
      />
    );
  }

  return (
    <div className="">
      {/* <DashboardNav /> */}
      <div className="">{children}</div>
      <MobileDetails />
      <Upload />
      <AudioControlls />
      {/* <DeleteBox/> */}
      {/* dark overlay */}
      {isOverlayVisible && (
        <div className="h-screen fixed top-0 bottom-0 right-0 left-0 bg-black opacity-20 z-10"></div>
      )}
    </div>
  );
}

export default DashboardLayout;
