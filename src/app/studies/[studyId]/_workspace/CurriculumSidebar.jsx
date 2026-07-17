import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  LockKeyhole,
  Loader2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { getLessonProgress, getLessonProgressLabel, getModuleProgress } from "./helpers";

export function CurriculumSidebar({
  modules,
  checkpoints,
  selectedItemId,
  expandedModules,
  onToggleModule,
  onSelectItem,
  onResume,
  resumeLoading,
  isModuleLocked,
  mobile = false,
}) {
  return (
    <aside className={[
      "flex h-full flex-col border-grey-25 bg-white dark:border-dark-border dark:bg-dark-surface",
      mobile ? "" : "sticky top-[73px] max-h-[calc(100vh-73px)] border-l",
    ].join(" ")}>
      <div className="border-b border-grey-25 px-4 py-4 dark:border-dark-border">
        <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
          Course content
        </p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <h2 className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
            Modules and lessons
          </h2>
          <Badge variant="neutral">{modules.length} modules</Badge>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {modules.map((module) => {
          const lessons = Array.isArray(module.lessons) ? module.lessons : [];
          const isReady = module.status === "ready";
          const isFailed = module.status === "failed";
          const isGenerating = module.status === "generating";
          const isPending = module.status === "pending";
          const unavailable = isGenerating || isPending;
          const locked = isReady && isModuleLocked(module);
          const moduleKey = module.id || module.module_number;
          const isExpanded = expandedModules.has(moduleKey);
          const moduleProgress = getModuleProgress(module);
          const modulePercent = Math.round(moduleProgress.percent_complete || 0);
          const checkpoint = checkpoints.find(
            (item) => item.afterModuleNumber === Number(module.module_number)
          );

          return (
            <div key={moduleKey}>
              <div className="border-b border-grey-25 dark:border-dark-border">
                <button
                  type="button"
                  disabled={locked || unavailable}
                  onClick={() => onToggleModule(moduleKey)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-off-white-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset disabled:cursor-not-allowed disabled:opacity-55 dark:hover:bg-dark-surface-soft dark:focus:ring-primary-25"
                >
                  {locked ? (
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-grey-100" aria-hidden="true" />
                  ) : isGenerating ? (
                    <Loader2 className="mt-0.5 h-4 w-4 shrink-0 text-primary aurify-loader-spin dark:text-primary-25" aria-hidden="true" />
                  ) : isPending ? (
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-grey-100 dark:text-dark-muted" aria-hidden="true" />
                  ) : isFailed ? (
                    <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                  ) : (
                    <ChevronDown className={[
                      "mt-0.5 h-4 w-4 shrink-0 text-grey-100 transition-transform dark:text-dark-muted",
                      isExpanded ? "rotate-0" : "-rotate-90",
                    ].join(" ")} aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-h6 font-semibold uppercase text-grey-100 poppins-font dark:text-dark-muted">
                        Module {module.module_number || "-"}
                      </span>
                      <Badge
                        variant={
                          locked || isPending
                            ? "neutral"
                            : isGenerating
                              ? "accent"
                              : isFailed
                                ? "error"
                                : moduleProgress.completed
                                  ? "success"
                                  : "primary"
                        }
                      >
                        {locked
                          ? "Locked"
                          : isGenerating
                            ? "Generating"
                            : isPending
                              ? "Queued"
                              : isFailed
                                ? "Needs resume"
                                : moduleProgress.completed
                                  ? "Completed"
                                  : "Ready"}
                      </Badge>
                    </div>
                    <h3 className="break-words text-h5 font-semibold leading-6 text-grey-200 inter-font dark:text-dark-text">
                      {module.title || "Untitled module"}
                    </h3>
                    {isReady ? (
                      <p className="mt-1 text-h6 text-p-text-darker inter-font dark:text-dark-muted">
                        {moduleProgress.completed_lessons}/{moduleProgress.total_lessons || lessons.length} lessons
                        {module.estimated_minutes ? ` - ${module.estimated_minutes} min` : ""}
                      </p>
                    ) : (
                      <p className="mt-1 text-h6 text-p-text-darker inter-font dark:text-dark-muted">
                        {isGenerating
                          ? "Creating lessons now"
                          : isPending
                            ? "Waiting for a generation slot"
                            : "Generation did not finish"}
                      </p>
                    )}
                    {isReady && !locked ? (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-h6 inter-font">
                          <span className="text-grey-100 dark:text-dark-muted">Module progress</span>
                          <span className="font-semibold text-grey-200 dark:text-dark-text">{modulePercent}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft">
                          <div className="h-full rounded-full bg-primary transition-all duration-350 dark:bg-dark-accent" style={{ width: `${modulePercent}%` }} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </button>

                {isExpanded && !locked && !unavailable ? (
                  <div className="bg-off-white-100/70 py-2 dark:bg-dark-bg">
                    {isReady ? lessons.map((lesson, index) => {
                      const itemId = `${module.id || module.module_number}-lesson-${lesson.id || index}`;
                      const lessonProgress = getLessonProgress(lesson);
                      const lessonState = getLessonProgressLabel(lessonProgress);
                      const isSelected = selectedItemId === itemId;
                      return (
                        <button
                          key={itemId}
                          type="button"
                          onClick={() => onSelectItem({ id: itemId, type: "lesson", module, lesson, lessonIndex: index })}
                          className={[
                            "flex w-full items-start gap-3 border-l-2 px-5 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset dark:focus:ring-primary-25",
                            isSelected
                              ? "border-primary bg-white text-primary dark:border-primary-25 dark:bg-dark-surface dark:text-primary-25"
                              : "border-transparent text-p-text-darker hover:bg-white hover:text-grey-200 dark:text-dark-muted dark:hover:bg-dark-surface dark:hover:text-dark-text",
                          ].join(" ")}
                        >
                          {lessonProgress.status === "completed" ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                          ) : lessonProgress.status === "practice_pending" ? (
                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-grey-100 dark:text-dark-muted" aria-hidden="true" />
                          )}
                          <span className="min-w-0">
                            <span className="block text-h6 font-semibold inter-font">{lesson.title || `Lesson ${index + 1}`}</span>
                            <span className="mt-1 flex flex-wrap items-center gap-2 text-h6 text-grey-100 dark:text-dark-muted">
                              <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" />{lesson.estimated_minutes || 7} min</span>
                              <Badge variant={lessonState.variant}>{lessonState.label}</Badge>
                            </span>
                          </span>
                        </button>
                      );
                    }) : (
                      <div className="px-5 py-4">
                        <div className="rounded-md border border-error/30 bg-error-light p-3 dark:bg-error/15">
                          <p className="text-h6 leading-5 text-error inter-font dark:text-red-300">{module.generation_error || "This module did not finish generating."}</p>
                          {onResume ? <Button variant="ghost" size="sm" loading={resumeLoading} onClick={onResume} className="mt-3"><RefreshCw size={14} aria-hidden="true" />Resume</Button> : null}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {checkpoint ? (
                <button
                  type="button"
                  onClick={() => onSelectItem(checkpoint)}
                  className={[
                    "flex w-full items-start gap-3 border-b border-l-2 px-5 py-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset dark:border-dark-border dark:focus:ring-primary-25",
                    selectedItemId === checkpoint.id
                      ? "border-l-primary bg-white text-primary dark:border-l-primary-25 dark:bg-dark-surface dark:text-primary-25"
                      : "border-l-transparent border-b-grey-25 bg-accent-25/60 text-grey-200 hover:bg-accent-25 dark:bg-dark-surface-soft dark:text-dark-text",
                  ].join(" ")}
                >
                  {checkpoint.resolved ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  ) : checkpoint.lessonsComplete ? (
                    <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  ) : (
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-grey-100" aria-hidden="true" />
                  )}
                  <span>
                    <span className="block text-h6 font-semibold inter-font">{checkpoint.title}</span>
                    <span className="mt-1 block text-h6 text-grey-100 dark:text-dark-muted">
                      {checkpoint.resolved ? "Completed" : checkpoint.lessonsComplete ? "Required before continuing" : "Finish this module group to unlock"}
                    </span>
                  </span>
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
