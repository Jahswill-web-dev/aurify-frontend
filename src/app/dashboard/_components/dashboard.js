"use client";
import { Details } from "./details";
import back from "../../../../public/icons/darkback.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardNav from "./dashboardNav";
import SideNav from "./sideNav";

function Dashboard({ comp, name }) {
  // const pathname = usePathname();-
  // console.log(pathname);
  // let componentToRender;
  // switch (pathname) {
  //   case "#questions":
  //     componentToRender = <Questions />;
  //     break;
  //   case "#summary":
  //     componentToRender = <Summary />;
  //     break;
  //   default:
  //     componentToRender = <Pdfs />;
  // }
  const router = useRouter();

  return (
    <div>
      <DashboardNav />
      <div className="flex w-full py-3">
        <SideNav />
        <div className="min-[200px]:w-full sm:w-[70%] lg:w-[80%] flex justify-end">
          {comp}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
