import DashboardNav from "./_components/dashboardNav";
import SideNav from "./_components/sideNav";
import Main from "./_components/main";

function DashboardPage() {
  return (
    <div className="">
      <DashboardNav />
      <div className="flex flex-col md:flex-row p-5 mt-5 gap-5">
        <SideNav />
        <Main />
      </div>
    </div>
  );
}

export default DashboardPage;
