import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, Tabs } from "@/components/ui";
import { workspaceTabs } from "./constants";
import { CurriculumSidebar } from "./CurriculumSidebar";
import { LessonReader } from "./LessonReader";
import { MaterialTab } from "./MaterialTab";
import { RevisionCheckpointReader } from "./practice/RevisionCheckpointReader";

const getSortedModules = (modules) =>
  Array.isArray(modules)
    ? [...modules].sort(
        (first, second) =>
          Number(first?.module_number || 0) - Number(second?.module_number || 0)
      )
    : [];

const getLessonItems = (modules) =>
  modules.flatMap((module) =>
    module.status === "ready" && Array.isArray(module.lessons)
      ? module.lessons.map((lesson, index) => ({
          id: `${module.id || module.module_number}-lesson-${lesson.id || index}`,
          type: "lesson",
          module,
          lesson,
          lessonIndex: index,
        }))
      : []
  );

export function CoursePlayerWorkspace({
  activeMode,
  onModeChange,
  study,
  material,
  progress,
  lessonProgress,
  lessonPracticeState,
  revisionCheckpoints,
  isModuleLocked,
  notice,
  renderTool,
  onResume,
  resumeLoading,
  onCompleteLesson,
  onSelectLessonPracticeAnswer,
  onSubmitLessonPracticeAnswer,
  onAdvanceLessonPracticeQuestion,
  onSelectRevisionAnswer,
  onSubmitRevisionAnswer,
  onAdvanceRevisionQuestion,
  onRetryRevisionCheckpoint,
  onSkipRevisionCheckpoint,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const modules = useMemo(() => getSortedModules(material?.modules), [material?.modules]);
  const lessonItems = useMemo(() => getLessonItems(modules), [modules]);
  const checkpointItems = useMemo(
    () => revisionCheckpoints || [],
    [revisionCheckpoints]
  );
  const curriculumItems = useMemo(
    () =>
      modules.flatMap((module) => {
        const moduleLessons = lessonItems.filter(
          (item) => item.module?.id === module.id
        );
        const checkpoint = checkpointItems.find(
          (item) => item.afterModuleNumber === Number(module.module_number)
        );
        return checkpoint ? [...moduleLessons, checkpoint] : moduleLessons;
      }),
    [checkpointItems, lessonItems, modules]
  );

  const activeSelectedItem = useMemo(() => {
    if (!selectedItem?.id) return null;
    return (
      lessonItems.find((item) => item.id === selectedItem.id) ||
      checkpointItems.find((item) => item.id === selectedItem.id) ||
      null
    );
  }, [checkpointItems, lessonItems, selectedItem?.id]);

  const courseProgress = Math.round(
    typeof lessonProgress?.percent_complete === "number"
      ? lessonProgress.percent_complete
      : progress
  );

  useEffect(() => {
    const firstReadyModule = modules.find((module) => module.status === "ready");
    const firstItem = lessonItems[0] || null;
    setSelectedItem((current) =>
      current &&
      (lessonItems.some((item) => item.id === current.id) ||
        checkpointItems.some((item) => item.id === current.id))
        ? current
        : firstItem
    );
    setExpandedModules((current) =>
      current.size
        ? current
        : new Set(
            modules
              .filter((module) => module.status === "ready" || module.status === "failed")
              .slice(0, firstReadyModule ? 2 : 1)
              .map((module) => module.id || module.module_number)
          )
    );
  }, [checkpointItems, lessonItems, modules]);

  const handleSelectItem = (item) => {
    if (item.type === "lesson" && isModuleLocked(item.module)) return;
    setSelectedItem(item);
    setMobileCurriculumOpen(false);
    if (activeMode !== "learn") onModeChange("learn");
  };

  const handleToggleModule = (moduleKey) => {
    setExpandedModules((current) => {
      const next = new Set(current);
      if (next.has(moduleKey)) next.delete(moduleKey);
      else next.add(moduleKey);
      return next;
    });
  };

  const continueAfterCheckpoint = (checkpoint) => {
    const nextLesson = lessonItems.find(
      (item) =>
        Number(item.module?.module_number || 0) > checkpoint.afterModuleNumber &&
        !isModuleLocked(item.module)
    );
    if (nextLesson) handleSelectItem(nextLesson);
  };

  const activeTool = activeMode === "learn" ? null : renderTool(activeMode);

  if (!modules.length) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          {notice}
          <MaterialTab material={material} study={study} onResume={onResume} resumeLoading={resumeLoading} />
        </div>
      </div>
    );
  }

  const sidebarProps = {
    modules,
    checkpoints: checkpointItems,
    selectedItemId: activeSelectedItem?.id || selectedItem?.id,
    expandedModules,
    onToggleModule: handleToggleModule,
    onSelectItem: handleSelectItem,
    onResume,
    resumeLoading,
    isModuleLocked,
  };

  return (
    <div className="min-h-[calc(100vh-150px)] bg-off-white-100 dark:bg-dark-bg">
      <div className="sticky top-0 z-30 border-b border-grey-25 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-surface sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">Study workspace</p>
            <h1 className="truncate text-h3 font-bold text-grey-200 poppins-font dark:text-dark-text">{study?.topic || material?.title || "Study"}</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="ghost" size="sm" onClick={() => setMobileCurriculumOpen(true)} className="lg:hidden"><Menu size={16} aria-hidden="true" />Course content</Button>
            <div className="w-full min-w-[220px] sm:w-[260px]">
              <div className="mb-1 flex items-center justify-between text-h6 inter-font">
                <span className="text-p-text dark:text-dark-muted">Lesson progress</span>
                <span className="font-semibold text-grey-200 dark:text-dark-text">{courseProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft">
                <div className="h-full rounded-full bg-primary transition-all duration-350 dark:bg-dark-accent" style={{ width: `${courseProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-[1440px]">
          <Tabs tabs={workspaceTabs} activeTab={activeMode} onChange={onModeChange} className="scrollbar-hide overflow-x-auto border-b-0 [&_button]:shrink-0" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          {notice}
          {activeMode === "learn" ? (
            activeSelectedItem?.type === "revision-checkpoint" ? (
              <RevisionCheckpointReader
                checkpoint={activeSelectedItem}
                onSelectAnswer={(answer) => onSelectRevisionAnswer(activeSelectedItem.id, answer)}
                onSubmit={() => onSubmitRevisionAnswer(activeSelectedItem.id)}
                onAdvance={() => onAdvanceRevisionQuestion(activeSelectedItem.id)}
                onRetry={() => onRetryRevisionCheckpoint(activeSelectedItem.id)}
                onSkip={() => onSkipRevisionCheckpoint(activeSelectedItem.id)}
                onContinue={() => continueAfterCheckpoint(activeSelectedItem)}
              />
            ) : !lessonItems.length ? (
              <MaterialTab
                material={material}
                study={study}
                onResume={onResume}
                resumeLoading={resumeLoading}
              />
            ) : (
              <LessonReader
                item={activeSelectedItem}
                curriculumItems={curriculumItems}
                lessonPracticeState={lessonPracticeState}
                onSelectItem={handleSelectItem}
                onCompleteLesson={onCompleteLesson}
                onSelectLessonPracticeAnswer={onSelectLessonPracticeAnswer}
                onSubmitLessonPracticeAnswer={onSubmitLessonPracticeAnswer}
                onAdvanceLessonPracticeQuestion={onAdvanceLessonPracticeQuestion}
              />
            )
          ) : activeTool}
        </main>
        <div className="hidden lg:block"><CurriculumSidebar {...sidebarProps} /></div>
      </div>

      {mobileCurriculumOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close course content" className="absolute inset-0 bg-grey-200/45 backdrop-blur-sm" onClick={() => setMobileCurriculumOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-xl bg-white shadow-modal dark:bg-dark-surface">
            <div className="flex items-center justify-between border-b border-grey-25 px-4 py-3 dark:border-dark-border">
              <span className="h-1 w-10 rounded-full bg-grey-25 dark:bg-dark-border" />
              <button type="button" aria-label="Close course content" onClick={() => setMobileCurriculumOpen(false)} className="rounded-sm p-2 text-grey-100 hover:bg-off-white-100 focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-muted dark:hover:bg-dark-surface-soft"><X size={20} aria-hidden="true" /></button>
            </div>
            <div className="max-h-[calc(88vh-57px)] overflow-y-auto"><CurriculumSidebar {...sidebarProps} mobile /></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
