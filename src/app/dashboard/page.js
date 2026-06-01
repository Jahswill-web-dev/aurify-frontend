"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dashboard } from "./_components/dashboard";
import { MySummaries } from "./_components/mySummaries";
import { PracticeQuestions } from "./_components/practiceQuestions";
import { ScoresResults } from "./_components/scoresResults";
import { Sidebar } from "./_components/sideNav";
import LearnScreen from "./_components/LearnScreen";
import AnalysisLoader from "./_components/AnalysisLoader";
import ConfirmationCard from "./_components/ConfirmationCard";
import LearningPath from "./_components/LearningPath";
import WorkspaceShell from "./_components/workspace/WorkspaceShell";

function App() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("learn");
  const [learnInput, setLearnInput] = useState("");
  const [learnDraftInput, setLearnDraftInput] = useState("");
  const [parsedTopic, setParsedTopic] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [workspaceActive, setWorkspaceActive] = useState(false);
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
      case "learn":
        if (!learnInput) {
          return (
            <LearnScreen
              initialValue={learnDraftInput}
              onSubmit={(value) => {
                setLearnInput(value);
                setParsedTopic(null);
                setLearningPath(null);
                setWorkspaceActive(false);
              }}
            />
          );
        }

        if (!parsedTopic) {
          return (
            <AnalysisLoader
              input={learnInput}
              onComplete={(parsed) => setParsedTopic(parsed)}
            />
          );
        }

        if (learningPath) {
          if (workspaceActive && learningPath !== "loading") {
            return (
              <WorkspaceShell
                learningPath={learningPath}
                confirmedSetup={parsedTopic}
                onExit={() => setWorkspaceActive(false)}
              />
            );
          }

          return (
            <LearningPath
              confirmedSetup={parsedTopic}
              initialPath={learningPath !== "loading" ? learningPath : null}
              onBack={() => setLearningPath(null)}
              onStart={(path) => {
                setLearningPath(path);
                setWorkspaceActive(true);
              }}
            />
          );
        }

        return (
          <ConfirmationCard
            parsed={parsedTopic}
            onGenerate={(confirmedSetup) => {
              setParsedTopic(confirmedSetup);
              setLearningPath("loading");
              setWorkspaceActive(false);
            }}
            onEditTopic={(currentSetup) => {
              setLearnDraftInput(currentSetup.topic || learnInput);
              setLearnInput("");
              setParsedTopic(null);
              setLearningPath(null);
              setWorkspaceActive(false);
            }}
            onReset={() => {
              setLearnInput("");
              setLearnDraftInput("");
              setParsedTopic(null);
              setLearningPath(null);
              setWorkspaceActive(false);
            }}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            onViewSummary={() => setShowSummaryDetail(true)}
            onCreateStudy={() => router.push("/studies/new")}
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
