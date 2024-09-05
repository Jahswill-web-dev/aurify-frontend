"use client";
import Main from "./_components/main";
import Pdfs from "./_components/pdfs";
import { LoginPopUp } from "./_components/loginPopUp";
import { useFetchWithToken } from "../hooks/useCustomHook";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  setUserLimit,
  setUserName,
  setUserEmail,
  setUserSubscription,
} from "../lib/features/dashboard/dashboardSlice";

function DashboardPage() {
  const dispatch = useDispatch();
  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_BASE_URL}/me`
  );
  useEffect(() => {
    if (data && !error && !loading) {
      console.log(data.data);
      dispatch(setUserName(data.data.username));
      dispatch(setUserEmail(data.data.email));
      dispatch(setUserLimit(data.data.limit));
      dispatch(setUserSubscription(data.data.is_pro));
    }
  }, [data, error, loading]);
  console.log(error?.response?.status);
  if (error?.response?.status === 403) return <LoginPopUp/>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <Main centerComp={<Pdfs />} />;
}

export default DashboardPage;
