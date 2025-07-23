// "use client";
// import { Details } from "./details";
// import back from "../../../../public/icons/darkback.svg";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import DashboardNav from "./dashboardNav";
// import SideNav from "./sideNav";

// function Dashboard({ comp, name }) {
//   // const pathname = usePathname();-
//   // console.log(pathname);
//   // let componentToRender;
//   // switch (pathname) {
//   //   case "#questions":
//   //     componentToRender = <Questions />;
//   //     break;
//   //   case "#summary":
//   //     componentToRender = <Summary />;
//   //     break;
//   //   default:
//   //     componentToRender = <Pdfs />;
//   // }
//   const router = useRouter();

//   return (
//     <div>
//       <DashboardNav />
//       <div className="flex w-full py-3">
//         <SideNav />
//         <div className="min-[200px]:w-full sm:w-[70%] lg:w-[80%] flex justify-end">
//           {comp}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React from 'react';
import { motion } from 'framer-motion';
import { WelcomeSection } from './welcomeSection';
import { RecentStudies } from './recentStudies';

export const Dashboard = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <WelcomeSection />
        <RecentStudies />
      </div>
    </div>
  );
};
