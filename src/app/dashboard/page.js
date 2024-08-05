import DashboardNav from "./_components/dashboardNav";
import SideNav from "./_components/sideNav";
import Main from "./_components/main";
import { MobileDetails } from "../dashboard/_components/details";

function DashboardPage() {
  return (
    <div className="max-w-[1557px] mx-auto">
      <DashboardNav />
      <div className="flex flex-col md:flex-row md:justify-between py-5 mt-5 gap-2 md:pr-2">
        <SideNav />
        <Main />
      </div>
      <MobileDetails/>
    </div>
  );
}

export default DashboardPage;
