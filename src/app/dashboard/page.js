"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dashboard } from "./_components/dashboard";
import { MySummaries } from "./_components/mySummaries";
import { PracticeQuestions } from "./_components/practiceQuestions";
import { ScoresResults } from "./_components/scoresResults";
import { Sidebar } from "./_components/sideNav";
import { CreateStudyModal } from "./_components/createStudyModal";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showSummaryDetail, setShowSummaryDetail] = useState(false);
  const [showCreateStudyModal, setShowCreateStudyModal] = useState(false);

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
            onCreateStudy={() => setShowCreateStudyModal(true)}
          />
        );
      case "summaries":
        return <MySummaries onViewSummary={() => setShowSummaryDetail(true)} />;
      case "practice":
        return <PracticeQuestions />;
      case "scores":
        return <ScoresResults />;
      default:
        return (
          <Dashboard
            onViewSummary={() => setShowSummaryDetail(true)}
            onCreateStudy={() => setShowCreateStudyModal(true)}
          />
        );
    }
  };

  if (showSummaryDetail) {
    return renderMainContent();
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCreateStudy={() => setShowCreateStudyModal(true)}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div
          className={`min-w-0 overflow-hidden transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64 sm:ml-72 lg:ml-80"
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

      {/* Create Study Modal */}
      <CreateStudyModal
        isOpen={showCreateStudyModal}
        onClose={() => setShowCreateStudyModal(false)}
      />
    </>
  );
}

export default App;
