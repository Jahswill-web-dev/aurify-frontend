// "use client";
// import Dashboard from "./_components/dashboard";
// import Pdfs from "./_components/pdfs";
// import Loading from "./_components/loading";

// function DashboardPage() {
//   return <Dashboard comp={<Pdfs />} /> ? (
//     <Dashboard comp={<Pdfs />} name="pdf" />
//   ) : (
//     <Loading />
//   );
// }

// export default DashboardPage;
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dashboard } from './_components/dashboard';
import { MySummaries } from './_components/mySummaries';
import { PracticeQuestions } from './_components/practiceQuestions';
import { ScoresResults } from './_components/scoresResults';
import { Sidebar } from './_components/sideNav';

function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'summaries':
        return <MySummaries />;
      case 'practice':
        return <PracticeQuestions />;
      case 'scores':
        return <ScoresResults />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
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
  );
}

export default DashboardPage;