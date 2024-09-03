"use client";
import DashboardNav from "./_components/dashboardNav";
import SideNav from "./_components/sideNav";
import { MobileDetails } from "../dashboard/_components/details";
import Upload from "./_components/upload";
import { useSelector } from "react-redux";

function DashboardLayout({ children }) {
  const { showOverlay } = useSelector((store) => store.dashboard);
  const { navOverlay } = useSelector((store) => store.nav);
  // console.log(navOverlay);
  // if(loading){

  // }
  return (
    <div className="max-w-[1557px] mx-auto">
      <DashboardNav />
      <div className="flex flex-col md:flex-row md:justify-between py-5 mt-5 gap-2 md:pr-2">
        <SideNav />
        {children}
      </div>
      <MobileDetails />
      <Upload />
      {/* <DeleteBox/> */}
      {/* dark overlay */}
      <div
        className={`${showOverlay ? "block" : "hidden"} ${
          navOverlay ? "block" : "hidden"
        } h-screen fixed top-0 bottom-0 right-0 left-0 bg-black opacity-20 z-10`}
      ></div>
      {showOverlay || navOverlay ? <div
        className={`h-screen fixed top-0 bottom-0 right-0 left-0 bg-black opacity-20 z-10`}
      ></div>:"" }
      
    </div>
  );
}

export default DashboardLayout;
