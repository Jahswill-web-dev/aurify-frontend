"use client";
import Summary from "../../_components/summary";
import DashboardNav from "../../_components/dashboardNav";
import SideNav from "../../_components/sideNav";
import { useEffect, useState } from "react";

function SubjectNotesPage({ params }) {
  const slug = params.slug;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* <DashboardNav /> */}
      <Summary slug={slug} />
      {isMobile && <SideNav />}
    </div>
  );
}

export default SubjectNotesPage;
