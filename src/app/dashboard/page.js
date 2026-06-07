"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dashboard } from "./_components/dashboard";
import { ScoresResults } from "./_components/scoresResults";
import { Sidebar } from "./_components/sideNav";

function App() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showSummaryDetail, setShowSummaryDetail] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            onViewSummary={() => setShowSummaryDetail(true)}
            onCreateStudy={() => router.push("/studies/new")}
          />
        );
      case "scores":
        return <ScoresResults />;
      default:
        return (
          <Dashboard
            onViewSummary={() => setShowSummaryDetail(true)}
            onCreateStudy={() => router.push("/studies/new")}
          />
        );
    }
  };

  if (showSummaryDetail) {
    return renderMainContent();
  }

  return (
    <>
      <div className="min-h-screen bg-off-white-100 flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCreateStudy={() => router.push("/studies/new")}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div
          className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64 sm:ml-72"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full min-h-screen sm:min-h-0"
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </>
  );
}

export default App;
