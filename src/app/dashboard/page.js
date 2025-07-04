"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dashboard } from "./_components/dashboard";
import { MySummaries } from "./_components/mySummaries";
import { PracticeQuestions } from "./_components/practiceQuestions";
import { ScoresResults } from "./_components/scoresResults";
import { Sidebar } from "./_components/sideNav";
import { CreateStudyModal } from "./_components/createStudyModal";

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSummaryDetail, setShowSummaryDetail] = useState(false);
  const [showCreateStudyModal, setShowCreateStudyModal] = useState(false);

  const renderMainContent = () => {

    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            onViewSummary={() => setShowSummaryDetail(true)} 
            onCreateStudy={() => setShowCreateStudyModal(true)}
          />
        );
      case 'summaries':
        return <MySummaries onViewSummary={() => setShowSummaryDetail(true)} />;
      case 'practice':
        return <PracticeQuestions />;
      case 'scores':
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
        />
        
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
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