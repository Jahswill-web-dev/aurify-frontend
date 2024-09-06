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
import Loading from "./_components/loading";

function DashboardPage() {
  return <Main centerComp={<Pdfs />} /> ? (
    <Main centerComp={<Pdfs />} />
  ) : (
    <Loading />
  );
}

export default DashboardPage;
