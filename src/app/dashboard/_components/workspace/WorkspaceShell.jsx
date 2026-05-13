"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Dropdown } from "@/components/ui";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceSidebar, { ModuleItem } from "./WorkspaceSidebar";
import WorkspaceTabBar from "./WorkspaceTabBar";
import NotesTab from "./tabs/NotesTab";
import PracticeTab from "./tabs/PracticeTab";
import ExamTab from "./tabs/ExamTab";
import AskAITab from "./tabs/AskAITab";
import ProgressTab from "./tabs/ProgressTab";

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "highschool", label: "High School" },
  { value: "university", label: "University" },
  { value: "interview", label: "Interview Prep" },
  { value: "advanced", label: "Advanced" },
];

const goalOptions = [
  { value: "understand", label: "Understand Deeply" },
  { value: "exam", label: "School Exam" },
  { value: "interview", label: "Interview Prep" },
  { value: "revise", label: "Quick Revision" },
  { value: "practice", label: "Practice Only" },
];

const getInitialLevel = (level = "") => {
  const normalized = String(level || "").toLowerCase();

  if (normalized.includes("university")) return "university";
  if (normalized.includes("interview")) return "interview";
  if (normalized.includes("advanced") || normalized.includes("professional")) {
    return "advanced";
  }
  if (
    normalized.includes("grade") ||
    normalized.includes("high") ||
    normalized.includes("school")
  ) {
    return "highschool";
  }

  return "beginner";
};

const getInitialGoal = (goal = "") => {
  const normalized = String(goal || "").toLowerCase();

  if (normalized.includes("exam")) return "exam";
  if (normalized.includes("interview")) return "interview";
  if (normalized.includes("revision") || normalized.includes("revise")) {
    return "revise";
  }
  if (normalized.includes("practice")) return "practice";

  return "understand";
};

function WorkspaceShell({ learningPath, confirmedSetup, onExit }) {
  const [activeTab, setActiveTab] = useState("notes");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(() =>
    getInitialLevel(confirmedSetup?.level)
  );
  const [selectedGoal, setSelectedGoal] = useState(() =>
    getInitialGoal(confirmedSetup?.goal)
  );

  const modules = useMemo(
    () => (Array.isArray(learningPath?.modules) ? learningPath.modules : []),
    [learningPath?.modules]
  );

  const renderTab = () => {
    switch (activeTab) {
      case "notes":
        return <NotesTab />;
      case "practice":
        return <PracticeTab />;
      case "exam":
        return <ExamTab />;
      case "ask-ai":
        return <AskAITab />;
      case "progress":
        return <ProgressTab />;
      default:
        return <NotesTab />;
    }
  };

  const handleModuleSelect = (index) => {
    setActiveModuleIndex(index);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-off-white">
      <WorkspaceHeader
        confirmedSetup={confirmedSetup}
        levelOptions={levelOptions}
        goalOptions={goalOptions}
        selectedLevel={selectedLevel}
        selectedGoal={selectedGoal}
        onLevelChange={setSelectedLevel}
        onGoalChange={setSelectedGoal}
        onExit={onExit}
        onOpenModules={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar
          modules={modules}
          activeModuleIndex={activeModuleIndex}
          isCollapsed={isSidebarCollapsed}
          levelOptions={levelOptions}
          goalOptions={goalOptions}
          selectedLevel={selectedLevel}
          selectedGoal={selectedGoal}
          onLevelChange={setSelectedLevel}
          onGoalChange={setSelectedGoal}
          onModuleSelect={handleModuleSelect}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <WorkspaceTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full"
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen ? (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[75vh] flex-col rounded-t-xl bg-white shadow-modal md:hidden"
          >
            <div className="mx-auto mb-1 mt-3 h-1 w-10 rounded-full bg-grey-25" />

            <div className="flex items-center justify-between border-b border-grey-25 px-5 py-3">
              <div>
                <p className="text-h5 font-semibold text-grey-200 poppins-font">
                  Learning Path
                </p>
                <p className="text-h6 text-p-text inter-font">
                  {modules.length} {modules.length === 1 ? "module" : "modules"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="text-grey-100 transition-colors duration-175 hover:text-grey-200"
                aria-label="Close modules"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {modules.map((module, index) => (
                <ModuleItem
                  key={module.id || index}
                  module={module}
                  index={index}
                  isActive={index === activeModuleIndex}
                  onSelect={handleModuleSelect}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-grey-25 px-5 py-4">
              <Dropdown
                label="Level"
                options={levelOptions}
                value={selectedLevel}
                onChange={setSelectedLevel}
                className="w-full"
                buttonClassName="w-full justify-between !bg-white !border-grey-25 !text-grey-200"
                menuClassName="bottom-full top-auto mb-1 w-full"
              />
              <Dropdown
                label="Goal"
                options={goalOptions}
                value={selectedGoal}
                onChange={setSelectedGoal}
                className="w-full"
                buttonClassName="w-full justify-between !bg-white !border-grey-25 !text-grey-200"
                menuClassName="bottom-full top-auto mb-1 w-full"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default WorkspaceShell;
