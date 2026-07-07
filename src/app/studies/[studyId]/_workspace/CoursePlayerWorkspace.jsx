import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Circle,
  FileText,
  ListTree,
  Menu,
  RefreshCw,
  X,
} from "lucide-react";
import { Badge, Button, Card, Modal, Tabs } from "@/components/ui";
import { workspaceTabs } from "./constants";
import {
  getLessonProgress,
  getLessonProgressLabel,
  getModuleProgress,
  getPracticeQuestionForLesson,
} from "./helpers";
import { LessonPracticePanel } from "./LessonPracticePanel";
import { MaterialTab } from "./MaterialTab";

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

function CurriculumSidebar({
  modules,
  selectedItemId,
  expandedModules,
  onToggleModule,
  onSelectItem,
  onResume,
  resumeLoading,
  mobile = false,
}) {
  return (
    <aside
      className={[
        "flex h-full flex-col border-grey-25 bg-white dark:border-dark-border dark:bg-dark-surface",
        mobile ? "" : "sticky top-[73px] max-h-[calc(100vh-73px)] border-l",
      ].join(" ")}
    >
      <div className="border-b border-grey-25 px-4 py-4 dark:border-dark-border">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
              Course content
            </p>
            <h2 className="mt-1 text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
              Modules and lessons
            </h2>
          </div>
          <Badge variant="neutral">{modules.length} modules</Badge>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {modules.map((module) => {
          const lessons = Array.isArray(module.lessons) ? module.lessons : [];
          const isReady = module.status === "ready";
          const isExpanded = expandedModules.has(module.id || module.module_number);
          const moduleKey = module.id || module.module_number;
          const moduleProgress = getModuleProgress(module);
          const modulePercent = Math.round(moduleProgress.percent_complete || 0);

          return (
            <div key={moduleKey} className="border-b border-grey-25 dark:border-dark-border">
              <button
                type="button"
                onClick={() => onToggleModule(moduleKey)}
                className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-off-white-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset dark:hover:bg-dark-surface-soft dark:focus:ring-primary-25"
              >
                <ChevronDown
                  className={[
                    "mt-0.5 h-4 w-4 shrink-0 text-grey-100 transition-transform dark:text-dark-muted",
                    isExpanded ? "rotate-0" : "-rotate-90",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-h6 font-semibold uppercase text-grey-100 poppins-font dark:text-dark-muted">
                      Module {module.module_number || "-"}
                    </span>
                    <Badge
                      variant={
                        !isReady
                          ? "error"
                          : moduleProgress.completed
                            ? "success"
                            : "primary"
                      }
                    >
                      {!isReady
                        ? "Needs resume"
                        : moduleProgress.completed
                          ? "Completed"
                          : "Ready"}
                    </Badge>
                  </div>
                  <h3 className="break-words text-h5 font-semibold leading-6 text-grey-200 inter-font dark:text-dark-text">
                    {module.title || "Untitled module"}
                  </h3>
                  <p className="mt-1 text-h6 text-p-text-darker inter-font dark:text-dark-muted">
                    {moduleProgress.completed_lessons}/
                    {moduleProgress.total_lessons || lessons.length} lessons
                    {module.estimated_minutes ? ` - ${module.estimated_minutes} min` : ""}
                  </p>
                  <p className="hidden">
                    {moduleProgress.completed_lessons}/
                    {moduleProgress.total_lessons || lessons.length} lessons
                    {module.estimated_minutes ? ` • ${module.estimated_minutes} min` : ""}
                  </p>
                  {isReady ? (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-h6 inter-font">
                        <span className="text-grey-100 dark:text-dark-muted">
                          Module progress
                        </span>
                        <span className="font-semibold text-grey-200 dark:text-dark-text">
                          {modulePercent}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-350 dark:bg-dark-accent"
                          style={{ width: `${modulePercent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </button>

              {isExpanded ? (
                <div className="bg-off-white-100/70 py-2 dark:bg-dark-bg">
                  {isReady ? (
                    <>
                      {lessons.map((lesson, index) => {
                        const itemId = `${module.id || module.module_number}-lesson-${lesson.id || index}`;
                        const isSelected = selectedItemId === itemId;
                        const lessonProgress = getLessonProgress(lesson);
                        const lessonState = getLessonProgressLabel(lessonProgress);

                        return (
                          <button
                            key={itemId}
                            type="button"
                            onClick={() =>
                              onSelectItem({
                                id: itemId,
                                type: "lesson",
                                module,
                                lesson,
                                lessonIndex: index,
                              })
                            }
                            className={[
                              "flex w-full items-start gap-3 border-l-2 px-5 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset dark:focus:ring-primary-25",
                              isSelected
                                ? "border-primary bg-white text-primary dark:border-primary-25 dark:bg-dark-surface dark:text-primary-25"
                                : "border-transparent text-p-text-darker hover:bg-white hover:text-grey-200 dark:text-dark-muted dark:hover:bg-dark-surface dark:hover:text-dark-text",
                            ].join(" ")}
                          >
                            {lessonProgress.status === "completed" ? (
                              <CheckCircle2
                                className="mt-0.5 h-4 w-4 shrink-0 text-success"
                                aria-hidden="true"
                              />
                            ) : lessonProgress.status === "practice_pending" ? (
                              <Clock
                                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                            ) : (
                              <Circle
                                className="mt-0.5 h-4 w-4 shrink-0 text-grey-100 dark:text-dark-muted"
                                aria-hidden="true"
                              />
                            )}
                            <span className="min-w-0">
                              <span className="block text-h6 font-semibold inter-font">
                                {lesson.title || `Lesson ${index + 1}`}
                              </span>
                              <span className="mt-1 flex flex-wrap items-center gap-2 text-h6 text-grey-100 dark:text-dark-muted">
                                <span className="inline-flex items-center gap-1">
                                  <Clock size={12} aria-hidden="true" />
                                  {lesson.estimated_minutes || 7} min
                                </span>
                                <Badge variant={lessonState.variant}>
                                  {lessonState.label}
                                </Badge>
                              </span>
                            </span>
                          </button>
                        );
                      })}

                      {Array.isArray(module.practice_questions) && module.practice_questions.length ? (
                        <button
                          type="button"
                          onClick={() =>
                            onSelectItem({
                              id: `${module.id || module.module_number}-practice`,
                              type: "module-practice",
                              module,
                            })
                          }
                          className={[
                            "flex w-full items-start gap-3 border-l-2 px-5 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset dark:focus:ring-primary-25",
                            selectedItemId === `${module.id || module.module_number}-practice`
                              ? "border-primary bg-white text-primary dark:border-primary-25 dark:bg-dark-surface dark:text-primary-25"
                              : "border-transparent text-p-text-darker hover:bg-white hover:text-grey-200 dark:text-dark-muted dark:hover:bg-dark-surface dark:hover:text-dark-text",
                          ].join(" ")}
                        >
                          <ListTree className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          <span className="text-h6 font-semibold inter-font">
                            Module practice
                          </span>
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <div className="px-5 py-4">
                      <div className="rounded-md border border-error/30 bg-error-light p-3 dark:bg-error/15">
                        <p className="text-h6 leading-5 text-error inter-font dark:text-red-300">
                          {module.generation_error || "This module did not finish generating."}
                        </p>
                        {onResume ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            loading={resumeLoading}
                            onClick={onResume}
                            className="mt-3"
                          >
                            <RefreshCw size={14} aria-hidden="true" />
                            Resume
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function LessonReader({
  item,
  lessonItems,
  lessonPracticeState,
  onSelectItem,
  onCompleteLesson,
  onSelectLessonPracticeAnswer,
  onSubmitLessonPracticeAnswer,
}) {
  const currentIndex = lessonItems.findIndex((lessonItem) => lessonItem.id === item?.id);
  const previous = currentIndex > 0 ? lessonItems[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < lessonItems.length - 1
      ? lessonItems[currentIndex + 1]
      : null;
  const { module, lesson, lessonIndex } = item || {};
  const lessonProgress = getLessonProgress(lesson);
  const lessonState = getLessonProgressLabel(lessonProgress);
  const moduleProgress = getModuleProgress(module);
  const practiceState = lesson?.id ? lessonPracticeState?.[lesson.id] || {} : {};
  const practiceQuestion =
    practiceState.question ||
    (lessonProgress.status === "practice_pending"
      ? getPracticeQuestionForLesson(module, lesson)
      : null);
  const hasFeedback = Boolean(practiceState.feedback);
  const canContinue = hasFeedback || lessonProgress.completed;
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [lastAutoOpenedQuestionId, setLastAutoOpenedQuestionId] = useState("");

  useEffect(() => {
    const freshQuestionId = practiceState.question?.id;

    if (
      freshQuestionId &&
      freshQuestionId !== lastAutoOpenedQuestionId &&
      !practiceState.feedback
    ) {
      setPracticeModalOpen(true);
      setLastAutoOpenedQuestionId(freshQuestionId);
    }
  }, [
    lastAutoOpenedQuestionId,
    practiceState.feedback,
    practiceState.question?.id,
  ]);

  if (!lesson) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <FileText className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Choose a lesson
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          Select a ready lesson from the course content panel.
        </p>
      </Card>
    );
  }

  return (
    <article className="mx-auto max-w-[900px]">
      <Card variant="default" className="p-5 sm:p-7">
        <div className="mb-6 flex flex-col gap-3 border-b border-grey-25 pb-5 dark:border-dark-border sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="accent">Module {module.module_number || "-"}</Badge>
              <Badge variant="neutral">Lesson {(lesson.lesson_number || lessonIndex + 1)}</Badge>
              <Badge variant="neutral">
                <Clock size={13} aria-hidden="true" />
                {lesson.estimated_minutes || 7} min
              </Badge>
              <Badge variant={lessonState.variant}>{lessonState.label}</Badge>
            </div>
            <h1 className="text-xl-head font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
              {lesson.title || "Untitled lesson"}
            </h1>
            <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
              {module.objective || "Work through this lesson, then continue to the next item."}
            </p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none text-grey-200 prose-p:leading-7 prose-a:text-primary dark:prose-invert dark:text-dark-text">
          <ReactMarkdown>{lesson.content || ""}</ReactMarkdown>
        </div>

        {Array.isArray(lesson.key_takeaways) && lesson.key_takeaways.length ? (
          <div className="mt-6 rounded-md border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-surface-soft">
            <h2 className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
              Key takeaways
            </h2>
            <ul className="mt-3 grid gap-2">
              {lesson.key_takeaways.map((takeaway) => (
                <li
                  key={takeaway}
                  className="flex gap-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted"
                >
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-primary dark:text-primary-25"
                    aria-hidden="true"
                  />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {lessonProgress.status === "not_started" && !practiceState.question ? (
          <div className="mt-6 rounded-md border border-primary/25 bg-accent-25 p-4 dark:border-primary-25/30 dark:bg-dark-surface-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-h5 font-semibold text-grey-200 inter-font dark:text-dark-text">
                  Ready to check this lesson?
                </p>
                <p className="mt-1 text-h6 leading-5 text-p-text-darker inter-font dark:text-dark-muted">
                  Complete the lesson to unlock its practice question.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                loading={practiceState.completing}
                onClick={() => onCompleteLesson(lesson.id)}
                className="shrink-0"
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                Complete lesson
              </Button>
            </div>
            {practiceState.error ? (
              <p className="mt-3 rounded-sm border border-error/30 bg-error-light px-3 py-2 text-h6 leading-5 text-error inter-font dark:bg-error/15 dark:text-red-300">
                {practiceState.error}
              </p>
            ) : null}
          </div>
        ) : null}

        {lessonProgress.status === "practice_pending" || practiceState.question || hasFeedback ? (
          <div className="mt-6 rounded-md border border-primary/25 bg-white p-4 dark:border-primary-25/30 dark:bg-dark-surface-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-h5 font-semibold text-grey-200 inter-font dark:text-dark-text">
                  Lesson practice is ready
                </p>
                <p className="mt-1 text-h6 leading-5 text-p-text-darker inter-font dark:text-dark-muted">
                  Complete the lesson by answering its practice question.
                </p>
              </div>
              <Button
                variant={hasFeedback ? "ghost" : "primary"}
                size="md"
                onClick={() => setPracticeModalOpen(true)}
                className="shrink-0"
              >
                {hasFeedback ? "Review feedback" : "Complete lesson"}
              </Button>
            </div>
            {practiceState.error ? (
              <p className="mt-3 rounded-sm border border-error/30 bg-error-light px-3 py-2 text-h6 leading-5 text-error inter-font dark:bg-error/15 dark:text-red-300">
                {practiceState.error}
              </p>
            ) : null}
          </div>
        ) : null}

        {lessonProgress.completed && !hasFeedback ? (
          <div className="mt-6 rounded-md border border-success/30 bg-success-light p-4 text-success dark:bg-success/15 dark:text-green-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="text-h5 font-semibold inter-font">
                Lesson completed
              </p>
            </div>
          </div>
        ) : null}

        {moduleProgress.completed && canContinue ? (
          <div className="mt-4 rounded-md border border-success/30 bg-white p-4 dark:border-success/30 dark:bg-dark-surface-soft">
            <div className="flex items-center gap-2 text-success dark:text-green-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="text-h5 font-semibold inter-font">Module complete</p>
            </div>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 border-t border-grey-25 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border">
          <Button
            variant="ghost"
            size="md"
            disabled={!previous}
            onClick={() => previous && onSelectItem(previous)}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Previous lesson
          </Button>
          {canContinue ? (
            <Button
              variant="primary"
              size="md"
              disabled={!next}
              onClick={() => next && onSelectItem(next)}
            >
              Next lesson
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          ) : (
            <Badge variant={lessonProgress.status === "practice_pending" ? "accent" : "neutral"}>
              {lessonProgress.status === "practice_pending"
                ? "Practice pending"
                : "Complete lesson to continue"}
            </Badge>
          )}
        </div>
      </Card>

      <Modal
        isOpen={practiceModalOpen}
        onClose={() => {
          if (!practiceState.submitting) setPracticeModalOpen(false);
        }}
        title="Lesson practice"
        className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-[860px] sm:p-6 lg:max-w-[920px]"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="accent">Module {module.module_number || "-"}</Badge>
          <Badge variant="neutral">
            Lesson {lesson.lesson_number || lessonIndex + 1}
          </Badge>
          <Badge variant={lessonState.variant}>{lessonState.label}</Badge>
        </div>

        <LessonPracticePanel
          question={practiceQuestion}
          selectedAnswer={practiceState.selectedAnswer || ""}
          feedback={practiceState.feedback}
          loading={practiceState.completing}
          submitting={practiceState.submitting}
          error={practiceState.error}
          onSelectAnswer={(answer) =>
            onSelectLessonPracticeAnswer(lesson.id, answer)
          }
          onSubmit={() => onSubmitLessonPracticeAnswer(lesson.id)}
        />

        {hasFeedback ? (
          <div className="mt-5 flex flex-col gap-3 border-t border-grey-25 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border">
            {moduleProgress.completed ? (
              <div className="flex items-center gap-2 text-success dark:text-green-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="text-h5 font-semibold inter-font">
                  Module complete
                </p>
              </div>
            ) : (
              <span />
            )}
            {next ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setPracticeModalOpen(false);
                  onSelectItem(next);
                }}
              >
                Next lesson
                <ChevronRight size={16} aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="md"
                onClick={() => setPracticeModalOpen(false)}
              >
                Close
              </Button>
            )}
          </div>
        ) : null}
      </Modal>
    </article>
  );
}

function ModulePracticeReader({ item }) {
  const questions = Array.isArray(item?.module?.practice_questions)
    ? item.module.practice_questions
    : [];

  return (
    <div className="mx-auto max-w-[900px]">
      <Card variant="default" className="p-5 sm:p-7">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
              Module practice
            </p>
            <h1 className="mt-1 text-h2 font-bold text-grey-200 poppins-font dark:text-dark-text">
              {item?.module?.title || "Practice"}
            </h1>
          </div>
          <Badge variant="neutral">{questions.length} questions</Badge>
        </div>

        <div className="grid gap-4">
          {questions.map((question, index) => (
            <div
              key={question.id || `${question.question}-${index}`}
              className="rounded-md border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-surface-soft"
            >
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="neutral">Question {index + 1}</Badge>
                {question.difficulty ? <Badge variant="accent">{question.difficulty}</Badge> : null}
                {question.weak_area ? <Badge variant="neutral">{question.weak_area}</Badge> : null}
              </div>
              <h2 className="text-h4 font-semibold leading-7 text-grey-200 poppins-font dark:text-dark-text">
                {question.question}
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(question.options || []).map((option) => (
                  <div
                    key={option}
                    className={[
                      "rounded-sm border px-3 py-2 text-h6 inter-font",
                      option === question.correct_answer
                        ? "border-success bg-success-light text-success dark:bg-success/15 dark:text-green-300"
                        : "border-grey-25 bg-white text-p-text-darker dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted",
                    ].join(" ")}
                  >
                    {option}
                  </div>
                ))}
              </div>
              {question.explanation ? (
                <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                  {question.explanation}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function CoursePlayerWorkspace({
  activeMode,
  onModeChange,
  study,
  material,
  progress,
  lessonProgress,
  lessonPracticeState,
  notice,
  renderTool,
  onResume,
  resumeLoading,
  onCompleteLesson,
  onSelectLessonPracticeAnswer,
  onSubmitLessonPracticeAnswer,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
  const modules = useMemo(() => getSortedModules(material?.modules), [material?.modules]);
  const lessonItems = useMemo(() => getLessonItems(modules), [modules]);
  const modulePracticeItems = useMemo(
    () =>
      modules
        .filter(
          (module) =>
            module.status === "ready" &&
            Array.isArray(module.practice_questions) &&
            module.practice_questions.length
        )
        .map((module) => ({
          id: `${module.id || module.module_number}-practice`,
          type: "module-practice",
          module,
        })),
    [modules]
  );
  const activeSelectedItem = useMemo(() => {
    if (!selectedItem?.id) return null;
    return (
      lessonItems.find((item) => item.id === selectedItem.id) ||
      modulePracticeItems.find((item) => item.id === selectedItem.id) ||
      null
    );
  }, [lessonItems, modulePracticeItems, selectedItem?.id]);
  const courseProgress = Math.round(
    typeof lessonProgress?.percent_complete === "number"
      ? lessonProgress.percent_complete
      : progress
  );
  const [expandedModules, setExpandedModules] = useState(new Set());

  useEffect(() => {
    const firstReadyModule = modules.find((module) => module.status === "ready");
    const firstItem = lessonItems[0] || null;
    setSelectedItem((current) =>
      current &&
      (lessonItems.some((item) => item.id === current.id) ||
        modulePracticeItems.some((item) => item.id === current.id))
        ? current
        : firstItem
    );
    setExpandedModules(
      new Set(
        modules
          .filter((module) => module.status === "ready" || module.status === "failed")
          .slice(0, firstReadyModule ? 2 : 1)
          .map((module) => module.id || module.module_number)
      )
    );
  }, [lessonItems, modulePracticeItems, modules]);

  const handleSelectItem = (item) => {
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

  return (
    <div className="min-h-[calc(100vh-150px)] bg-off-white-100 dark:bg-dark-bg">
      <div className="sticky top-0 z-30 border-b border-grey-25 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-surface sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
              Study workspace
            </p>
            <h1 className="truncate text-h3 font-bold text-grey-200 poppins-font dark:text-dark-text">
              {study?.topic || material?.title || "Study"}
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileCurriculumOpen(true)}
              className="lg:hidden"
            >
              <Menu size={16} aria-hidden="true" />
              Course content
            </Button>
            <div className="w-full min-w-[220px] sm:w-[260px]">
              <div className="mb-1 flex items-center justify-between text-h6 inter-font">
                <span className="text-p-text dark:text-dark-muted">Progress</span>
                <span className="font-semibold text-grey-200 dark:text-dark-text">{courseProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-350 dark:bg-dark-accent"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-[1440px]">
          <Tabs
            tabs={workspaceTabs}
            activeTab={activeMode}
            onChange={onModeChange}
            className="scrollbar-hide overflow-x-auto border-b-0 [&_button]:shrink-0"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          {notice}
          {activeMode === "learn" ? (
            activeSelectedItem?.type === "module-practice" ? (
              <ModulePracticeReader item={activeSelectedItem} />
            ) : (
              <LessonReader
                item={activeSelectedItem}
                lessonItems={lessonItems}
                lessonPracticeState={lessonPracticeState}
                onSelectItem={handleSelectItem}
                onCompleteLesson={onCompleteLesson}
                onSelectLessonPracticeAnswer={onSelectLessonPracticeAnswer}
                onSubmitLessonPracticeAnswer={onSubmitLessonPracticeAnswer}
              />
            )
          ) : (
            activeTool
          )}
        </main>

        <div className="hidden lg:block">
          <CurriculumSidebar
            modules={modules}
            selectedItemId={activeSelectedItem?.id || selectedItem?.id}
            expandedModules={expandedModules}
            onToggleModule={handleToggleModule}
            onSelectItem={handleSelectItem}
            onResume={onResume}
            resumeLoading={resumeLoading}
          />
        </div>
      </div>

      {mobileCurriculumOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close course content"
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileCurriculumOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[min(420px,92vw)] bg-white shadow-modal dark:bg-dark-surface">
            <div className="flex items-center justify-between border-b border-grey-25 px-4 py-3 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary dark:text-primary-25" aria-hidden="true" />
                <span className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
                  Course content
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileCurriculumOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-grey-25 text-p-text hover:border-primary hover:text-primary dark:border-dark-border dark:text-dark-muted dark:hover:border-primary-25 dark:hover:text-primary-25"
                aria-label="Close course content"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>
            <CurriculumSidebar
              modules={modules}
              selectedItemId={activeSelectedItem?.id || selectedItem?.id}
              expandedModules={expandedModules}
              onToggleModule={handleToggleModule}
              onSelectItem={handleSelectItem}
              onResume={onResume}
              resumeLoading={resumeLoading}
              mobile
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
