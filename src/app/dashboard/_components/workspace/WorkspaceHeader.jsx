"use client";

import { Menu } from "lucide-react";
import { Badge, Dropdown } from "@/components/ui";

function WorkspaceHeader({
  confirmedSetup,
  levelOptions,
  goalOptions,
  selectedLevel,
  selectedGoal,
  onLevelChange,
  onGoalChange,
  onExit,
  onOpenModules,
}) {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-grey-25 bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onExit}
          className="flex shrink-0 cursor-pointer items-center gap-1 text-h6 text-p-text transition-colors duration-175 hover:text-primary"
        >
          &larr; Exit
        </button>
        <span className="mx-2 h-5 w-px bg-grey-25" aria-hidden="true" />
        <h1 className="truncate text-h5 font-semibold text-grey-200 poppins-font">
          {confirmedSetup?.topic || "Untitled topic"}
        </h1>
        <div className="hidden items-center gap-2 sm:flex">
          <Badge variant="accent">{confirmedSetup?.subject || "General"}</Badge>
          <Badge variant="primary">{confirmedSetup?.level || "Beginner"}</Badge>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 md:flex">
        <Dropdown
          options={levelOptions}
          value={selectedLevel}
          onChange={onLevelChange}
          buttonClassName="!bg-white !border-grey-25 !text-grey-200 !text-h6"
          menuClassName="right-0"
        />
        <Dropdown
          options={goalOptions}
          value={selectedGoal}
          onChange={onGoalChange}
          buttonClassName="!bg-white !border-grey-25 !text-grey-200 !text-h6"
          menuClassName="right-0"
        />
      </div>

      <button
        type="button"
        onClick={onOpenModules}
        className="flex shrink-0 items-center gap-1 text-h6 font-medium text-primary md:hidden"
      >
        <Menu size={16} aria-hidden="true" />
        Modules
      </button>
    </header>
  );
}

export default WorkspaceHeader;
