"use client";

import { ChevronLeft } from "lucide-react";
import { Dropdown } from "@/components/ui";

function ModuleItem({
  module,
  index,
  isActive,
  isComplete = false,
  isCollapsed = false,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(index)}
      className={[
        "flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-all duration-175",
        isActive ? "border-r-2 border-primary bg-accent-100" : "hover:bg-off-white-50",
        isCollapsed ? "justify-center px-2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-current={isActive ? "step" : undefined}
    >
      <span
        className={[
          "mt-0.5 w-6 shrink-0 text-h6 font-bold poppins-font",
          isComplete ? "text-success" : "text-primary",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {!isCollapsed ? (
        <span className="min-w-0">
          <span className="flex min-w-0 items-center gap-2">
            <span className="block min-w-0 truncate text-h6 font-medium leading-snug text-grey-200 inter-font">
              {module.title || `Module ${index + 1}`}
            </span>
            {isComplete ? (
              <span className="shrink-0 text-h6 font-semibold text-success">
                ✓
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-x-description capitalize text-p-text inter-font">
            {module.type || "concept"} - {module.estimatedMinutes || 5} min
          </span>
        </span>
      ) : null}
    </button>
  );
}

function WorkspaceSidebar({
  modules = [],
  activeModuleIndex,
  isCollapsed,
  levelOptions,
  goalOptions,
  selectedLevel,
  selectedGoal,
  completedModules = [],
  onLevelChange,
  onGoalChange,
  onModuleSelect,
  onToggleCollapse,
}) {
  return (
    <aside
      className={[
        "hidden h-full flex-col overflow-hidden border-r border-grey-25 bg-white transition-all duration-350 ease-smooth md:flex",
        isCollapsed ? "w-16" : "w-68",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex items-center border-b border-grey-25 px-4 py-3",
          isCollapsed ? "justify-center" : "justify-between",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {!isCollapsed ? (
          <div className="min-w-0">
            <p className="text-h6 font-semibold text-grey-200 poppins-font">
              Learning Path
            </p>
            <p className="text-h6 text-p-text inter-font">
              {modules.length} {modules.length === 1 ? "module" : "modules"}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggleCollapse}
          className={[
            "text-grey-100 transition-all duration-250 hover:text-primary",
            isCollapsed ? "rotate-180" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label={isCollapsed ? "Expand modules" : "Collapse modules"}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {modules.map((module, index) => (
          <ModuleItem
            key={module.id || index}
            module={module}
            index={index}
            isActive={index === activeModuleIndex}
            isComplete={completedModules.includes(index)}
            isCollapsed={isCollapsed}
            onSelect={onModuleSelect}
          />
        ))}
      </div>

      {!isCollapsed ? (
        <div className="grid gap-2 border-t border-grey-25 px-4 py-3">
          <Dropdown
            label="Level"
            options={levelOptions}
            value={selectedLevel}
            onChange={onLevelChange}
            className="w-full"
            buttonClassName="w-full justify-between !bg-white !border-grey-25 !text-grey-200 !text-h6"
            menuClassName="bottom-full top-auto mb-1 w-full"
          />
          <Dropdown
            label="Goal"
            options={goalOptions}
            value={selectedGoal}
            onChange={onGoalChange}
            className="w-full"
            buttonClassName="w-full justify-between !bg-white !border-grey-25 !text-grey-200 !text-h6"
            menuClassName="bottom-full top-auto mb-1 w-full"
          />
        </div>
      ) : null}
    </aside>
  );
}

export { ModuleItem };
export default WorkspaceSidebar;
