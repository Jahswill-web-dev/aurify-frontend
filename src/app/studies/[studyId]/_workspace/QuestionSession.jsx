import { AlertCircle, ArrowLeft, BookOpen, ClipboardCheck, Play, Plus, RefreshCw, RotateCcw } from "lucide-react";
import { Badge, Button, Card, LoadingExperience } from "@/components/ui";
import { practiceReadyStatuses } from "./constants";
import { getQuestionSetCards } from "./helpers";
import { ProgressBar } from "./WorkspaceShell";

export function PracticeLoadingState() {
  return (
    <LoadingExperience
      variant="panel"
      title="Loading practice sets"
      message="Preparing questions and checking your saved progress."
    />
  );
}

export function PracticeUnavailableState({ study, error, onRetry, onResume, resumeLoading }) {
  const isReady = practiceReadyStatuses.has(study?.status);
  const canResumePractice =
    study?.status === "material_ready" ||
    study?.status === "glossary_ready" ||
    practiceReadyStatuses.has(study?.status);
  const resumeLabel =
    study?.status === "material_ready" || study?.status === "glossary_ready"
      ? "Generate Practice Questions"
      : "Resume Generation";

  return (
    <Card variant="default" className="mx-auto max-w-[680px] p-6 text-center">
      <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
        {isReady ? "Practice questions are not available" : "Practice is not ready yet"}
      </h2>
      <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
        {error ||
          (isReady
            ? "The backend marked this Study ready, but no practice questions were returned."
            : study?.status === "material_ready" || study?.status === "glossary_ready"
              ? "Material is ready, but practice questions have not been generated yet."
            : "The backend is still preparing practice questions for this Study.")}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="primary" size="md" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </Button>
        {canResumePractice ? (
          <Button
            variant="ghost"
            size="md"
            loading={resumeLoading}
            onClick={onResume}
          >
            <RotateCcw size={16} aria-hidden="true" />
            {resumeLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

export function PracticeResultSummary({ result, onReset }) {
  if (!result) return null;

  const score = Math.round(Number(result.score || 0));
  const weakAreas = result.weak_areas || [];

  return (
    <Card variant="accent" className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Practice submitted
          </p>
          <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
            {score}%
          </h2>
          <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
            {result.correct_count} of {result.total_questions} questions correct.
          </p>
        </div>
        <Button variant="ghost" size="md" onClick={onReset}>
          <RotateCcw size={16} aria-hidden="true" />
          Practice Again
        </Button>
      </div>
      {weakAreas.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {weakAreas.map((area) => (
            <Badge key={area} variant="error">
              {area}
            </Badge>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export function QuestionSetLanding({
  mode,
  sets,
  questions,
  title,
  count,
  generating,
  error,
  onSelectSet,
  onTitleChange,
  onCountChange,
  onGenerate,
  onRefresh,
}) {
  const cards = getQuestionSetCards({ mode, sets, questions });
  const label = mode === "practice" ? "Practice set" : "Exam set";
  const titleText = mode === "practice" ? "Practice question sets" : "Exam question sets";
  const actionText = mode === "practice" ? "Start Practice" : "Start Exam";
  const nextNumber = sets.length + 1;

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Question sets
          </p>
          <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
            {titleText}
          </h2>
        </div>
        <Button variant="ghost" size="md" onClick={onRefresh}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-h5 leading-6 inter-font">{error}</p>
        </div>
      ) : null}

      {cards.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((set) => (
            <Card
              key={set.id}
              variant="default"
              onClick={() => onSelectSet(set.id)}
              className="flex min-h-[190px] flex-col justify-between p-5"
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
                    {mode === "practice" ? (
                      <BookOpen size={20} aria-hidden="true" />
                    ) : (
                      <ClipboardCheck size={20} aria-hidden="true" />
                    )}
                  </div>
                  {set.isFallback ? (
                    <Badge variant="neutral">Latest</Badge>
                  ) : set.status && set.status !== "ready" ? (
                    <Badge variant="accent">{set.status}</Badge>
                  ) : null}
                </div>
                <h3 className="break-words text-h3 font-semibold leading-7 text-grey-200 poppins-font">
                  {set.title}
                </h3>
                <p className="mt-3 text-h5 text-p-text-darker inter-font">
                  {set.questionCount || "?"} questions
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-grey-25 pt-4 dark:border-dark-border">
                <span className="text-h5 font-semibold text-primary inter-font">
                  {actionText}
                </span>
                <Play size={17} className="text-primary" aria-hidden="true" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="default" className="p-6 text-center">
          <h3 className="text-h3 font-semibold text-grey-200 poppins-font">
            No ready sets yet
          </h3>
          <p className="mx-auto mt-2 max-w-[560px] text-h5 leading-7 text-p-text-darker inter-font">
            Generate a {label} to start working through questions.
          </p>
        </Card>
      )}

      <Card variant="default" className="p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
          <label className="grid gap-1 text-h6 font-medium text-p-text inter-font">
            <span>New title</span>
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder={`${label} ${nextNumber}`}
              className="min-h-[42px] rounded-sm border border-grey-25 bg-white px-3 text-h5 text-grey-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text"
            />
          </label>
          <label className="grid gap-1 text-h6 font-medium text-p-text inter-font">
            <span>Count</span>
            <input
              value={count}
              min={5}
              max={30}
              type="number"
              onChange={(event) => onCountChange(event.target.value)}
              className="min-h-[42px] rounded-sm border border-grey-25 bg-white px-3 text-h5 text-grey-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text"
            />
          </label>
        </div>

        <Button
          variant="primary"
          size="md"
          loading={generating}
          onClick={onGenerate}
          className="mt-4 w-full sm:w-auto"
        >
          <Plus size={16} aria-hidden="true" />
          Generate Set
        </Button>
      </Card>
    </div>
  );
}

export function SessionHeader({ mode, title, answeredCount, totalQuestions, onBack, children }) {
  const progress = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  return (
    <Card variant="default" className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button variant="text" size="sm" onClick={onBack} className="px-0">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sets
          </Button>
          <p className="mt-4 text-h6 font-semibold uppercase text-primary poppins-font">
            {mode === "practice" ? "Practice session" : "Exam session"}
          </p>
          <h2 className="mt-1 break-words text-h3 font-bold text-grey-200 poppins-font">
            {title}
          </h2>
        </div>
        {children}
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-h6 inter-font">
          <span className="text-p-text">Progress</span>
          <span className="font-semibold text-grey-200">
            {answeredCount} of {totalQuestions} answered
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>
    </Card>
  );
}

export function QuestionNumberGrid({ questions, answers, activeIndex, onActiveIndexChange, variant = "practice" }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-12">
      {questions.map((item, index) => {
        const isActive = index === activeIndex;
        const isAnswered = Boolean(answers[item.id]);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onActiveIndexChange(index)}
            className={[
              "flex aspect-square min-h-[36px] items-center justify-center rounded-sm border text-h6 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
              isActive
                ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                : isAnswered && variant === "practice"
                  ? "border-success bg-success-light text-success dark:bg-success/15 dark:text-green-300"
                  : isAnswered
                    ? "border-primary bg-accent-25 text-primary dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                    : "border-grey-25 bg-white text-p-text hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted dark:hover:border-primary-25 dark:hover:text-primary-25",
            ].join(" ")}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
