import DashboardNav from "./_components/dashboardNav";
import SideNav from "./_components/sideNav";
import { MobileDetails } from "../dashboard/_components/details";
import Upload from "./_components/upload";

function DashboardLayout({ children }) {
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
      <div className="h-screen hidden absolute top-0 bottom-0 right-0 left-0 bg-black opacity-20"></div>
    </div>
  );
}

export default DashboardLayout;
