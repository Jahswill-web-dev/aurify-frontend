"use client";

import { Tabs } from "@/components/ui";

const tabs = [
  { id: "notes", label: "Notes" },
  { id: "practice", label: "Practice" },
  { id: "exam", label: "Exam" },
  { id: "ask-ai", label: "Ask AI" },
  { id: "progress", label: "Progress" },
];

function WorkspaceTabBar({ activeTab, onTabChange }) {
  return (
    <div className="h-11 border-b border-grey-25 bg-white px-4 md:px-6">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={onTabChange}
        className="scrollbar-hide h-full items-end overflow-x-auto border-b-0 [&_button]:shrink-0 [&_button]:text-h6 sm:[&_button]:text-h5"
      />
    </div>
  );
}

export default WorkspaceTabBar;
