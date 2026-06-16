import { AlertCircle, ArrowLeft, ClipboardCheck, Clock, Play, RefreshCw, RotateCcw, Trophy } from "lucide-react";
import { Badge, Button, Card, LoadingExperience } from "@/components/ui";
import { examTimerOptions, latestSetId } from "./constants";
import { formatDuration } from "./helpers";
import { QuestionNumberGrid, QuestionSetLanding, SessionHeader } from "./QuestionSession";

export function ExamLoadingState() {
  return (
    <LoadingExperience
      variant="panel"
      title="Loading exam mode"
      message="Preparing your exam set, timer, and attempt state."
    />
  );
}

export function ExamUnavailableState({ study, error, onRetry, onResume, resumeLoading }) {
  const canResumeExam =
    study?.status === "practice_ready" ||
    study?.status === "generating_exam_questions" ||
    study?.status === "exam_ready";
  const resumeLabel =
    study?.status === "practice_ready"
      ? "Generate Exam Questions"
      : "Resume Generation";

  return (
    <Card variant="default" className="mx-auto max-w-[680px] p-6 text-center">
      <ClipboardCheck className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
        {study?.status === "exam_ready"
          ? "Exam questions are not available"
          : "Exam mode is not ready yet"}
      </h2>
      <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
        {error ||
          (study?.status === "practice_ready"
            ? "Practice is ready, but exam questions have not been generated yet."
            : study?.status === "generating_exam_questions"
              ? "The backend is preparing exam questions for this Study."
              : "The backend is still preparing this Study for exam mode.")}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="primary" size="md" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </Button>
        {canResumeExam ? (
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

export function ExamSetup({ questions, selectedTimer, onTimerChange, onStart }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
      <Card variant="default" className="p-5">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <ClipboardCheck size={20} aria-hidden="true" />
        </div>
        <p className="text-h6 font-semibold uppercase text-primary poppins-font">
          Exam setup
        </p>
        <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
          {questions.length} questions
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          Choose a timer option, then start when you are ready.
        </p>
      </Card>

      <Card variant="default" className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-h3 font-semibold text-grey-200 poppins-font">
            Timer
          </h2>
        </div>

        <div className="grid gap-2 sm:grid-cols-5">
          {examTimerOptions.map((option) => {
            const isSelected = selectedTimer === option.minutes;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onTimerChange(option.minutes)}
                aria-pressed={isSelected}
                className={[
                  "min-h-[48px] rounded-sm border px-3 py-2 text-h5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inter-font dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
                  isSelected
                    ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                    : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25 hover:text-primary dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:bg-dark-bg dark:hover:text-primary-25",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <Button variant="primary" size="lg" onClick={onStart} className="mt-6 w-full">
          <Play size={18} aria-hidden="true" />
          Start Exam
        </Button>
      </Card>
    </div>
  );
}

export function ExamResultSummary({ result, onReset }) {
  if (!result) return null;

  const score = Math.round(Number(result.score || 0));
  const weakAreas = result.weak_areas || [];
  const feedback = result.feedback || [];

  return (
    <div className="grid gap-5">
      <Card variant="accent" className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Exam submitted
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
            Retake Exam
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

      {feedback.length ? (
        <div className="grid gap-3">
          {feedback.map((item, index) => (
            <Card key={item.question_id || index} variant="default" className="p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Badge variant="neutral">Question {index + 1}</Badge>
                <Badge variant={item.is_correct ? "success" : "error"}>
                  {item.is_correct ? "Correct" : "Review"}
                </Badge>
              </div>
              <h3 className="text-h4 font-semibold leading-7 text-grey-200 poppins-font">
                {item.question}
              </h3>
              <div className="mt-4 grid gap-2 text-h5 leading-7 inter-font">
                <p className="text-p-text-darker">
                  <span className="font-semibold text-grey-200">Your answer:</span>{" "}
                  {item.selected_answer || "Not answered"}
                </p>
                <p className="text-p-text-darker">
                  <span className="font-semibold text-grey-200">Correct answer:</span>{" "}
                  {item.correct_answer}
                </p>
                {item.explanation ? (
                  <p className="text-p-text-darker">{item.explanation}</p>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ExamTab({
  study,
  questions,
  questionSets,
  selectedSetId,
  activeView,
  setTitle,
  setCount,
  setGenerating,
  loading,
  error,
  activeIndex,
  answers,
  started,
  selectedTimer,
  secondsRemaining,
  timedOut,
  submitError,
  submitLoading,
  attemptResult,
  resumeLoading,
  onRetry,
  onResume,
  onSelectSet,
  onBackToSets,
  onSetTitleChange,
  onSetCountChange,
  onGenerateSet,
  onTimerChange,
  onStart,
  onAddTime,
  onAnswer,
  onActiveIndexChange,
  onSubmit,
  onReset,
}) {
  if (study.status !== "exam_ready") {
    return (
      <ExamUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  if (loading) return <ExamLoadingState />;

  if (activeView === "sets") {
    return (
      <QuestionSetLanding
        mode="exam"
        sets={questionSets}
        questions={questions}
        title={setTitle}
        count={setCount}
        generating={setGenerating}
        error={error}
        onSelectSet={onSelectSet}
        onTitleChange={onSetTitleChange}
        onCountChange={onSetCountChange}
        onGenerate={onGenerateSet}
        onRefresh={onRetry}
      />
    );
  }

  if (error || !questions.length) {
    return (
      <ExamUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  const selectedSet = questionSets.find((set) => set.id === selectedSetId);
  const sessionTitle =
    selectedSet?.title || (selectedSetId === latestSetId ? "Latest Exam" : "Exam Set");

  if (attemptResult) {
    return (
      <div className="grid gap-5">
        <Button variant="text" size="sm" onClick={onBackToSets} className="w-fit px-0">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to sets
        </Button>
        <ExamResultSummary result={attemptResult} onReset={onReset} />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="grid gap-5">
        <SessionHeader
          mode="exam"
          title={sessionTitle}
          answeredCount={0}
          totalQuestions={questions.length}
          onBack={onBackToSets}
        />
        <ExamSetup
          questions={questions}
          selectedTimer={selectedTimer}
          onTimerChange={onTimerChange}
          onStart={onStart}
        />
      </div>
    );
  }

  const safeActiveIndex = Math.min(activeIndex, questions.length - 1);
  const question = questions[safeActiveIndex];
  const selectedAnswer = answers[question.id];
  const answeredCount = Object.keys(answers).filter((questionId) =>
    questions.some((item) => item.id === questionId)
  ).length;
  const hasTimer = selectedTimer > 0;
  const isAnsweringLocked = timedOut || submitLoading;

  return (
    <div className="grid gap-5">
      <SessionHeader
        mode="exam"
        title={sessionTitle}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onBack={onBackToSets}
      >
        <div className="flex min-w-[170px] items-center justify-between rounded-md border border-grey-25 bg-off-white-100 px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
          <div className="flex items-center gap-2 text-h5 font-semibold text-grey-200 inter-font">
            <Clock size={16} aria-hidden="true" />
            {hasTimer ? formatDuration(secondsRemaining) : "No timer"}
          </div>
          {hasTimer ? (
            <Badge variant={timedOut ? "error" : "accent"}>
              {timedOut ? "Time up" : "Running"}
            </Badge>
          ) : null}
        </div>
      </SessionHeader>

      <QuestionNumberGrid
        questions={questions}
        answers={answers}
        activeIndex={safeActiveIndex}
        onActiveIndexChange={onActiveIndexChange}
        variant="exam"
      />

      {timedOut ? (
        <Card variant="default" className="border-error bg-error-light p-5">
          <AlertCircle className="h-6 w-6 text-error" aria-hidden="true" />
          <h3 className="mt-2 text-h4 font-semibold text-grey-200 poppins-font">
            Time is up
          </h3>
          <p className="mt-1 text-h5 leading-7 text-p-text-darker inter-font">
            Add more time to continue this attempt, or submit your selected answers now.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Button variant="ghost" size="md" onClick={() => onAddTime(5)}>
              Add 5 min
            </Button>
            <Button variant="ghost" size="md" onClick={() => onAddTime(10)}>
              Add 10 min
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!answeredCount}
              loading={submitLoading}
              onClick={onSubmit}
            >
              Submit Now
            </Button>
          </div>
        </Card>
      ) : null}

      <Card variant="default" className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Badge variant="neutral">Question {safeActiveIndex + 1}</Badge>
          <div className="flex flex-wrap gap-2">
            {question.difficulty ? (
              <Badge variant="accent">{question.difficulty}</Badge>
            ) : null}
            {question.weak_area ? (
              <Badge variant="neutral">{question.weak_area}</Badge>
            ) : null}
          </div>
        </div>

        <h2 className="text-h3 font-semibold leading-snug text-grey-200 poppins-font">
          {question.question}
        </h2>

        <div className="mt-5 grid gap-3">
          {(question.options || []).map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                disabled={isAnsweringLocked}
                onClick={() => onAnswer(question.id, option)}
                className={[
                  "flex min-h-[52px] w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-h5 leading-6 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed inter-font dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
                  isSelected
                    ? "border-primary bg-accent-25 text-primary dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                    : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:bg-dark-bg dark:hover:text-primary-25",
                  isAnsweringLocked && !isSelected ? "opacity-60" : "",
                ].join(" ")}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <span
                    className={[
                      "h-4 w-4 rounded-full border",
                      isSelected ? "border-primary bg-primary" : "border-current",
                    ].join(" ")}
                  />
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {submitError ? (
          <div className="mt-5 flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="text-h5 leading-6 inter-font">{submitError}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 border-t border-grey-25 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="md"
              disabled={safeActiveIndex === 0}
              onClick={() => onActiveIndexChange(safeActiveIndex - 1)}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="md"
              disabled={safeActiveIndex === questions.length - 1}
              onClick={() => onActiveIndexChange(safeActiveIndex + 1)}
            >
              Next
            </Button>
          </div>
          <Button
            variant="primary"
            size="md"
            disabled={!answeredCount || timedOut}
            loading={submitLoading}
            onClick={onSubmit}
          >
            <Trophy size={16} aria-hidden="true" />
            Submit Exam
          </Button>
        </div>
      </Card>
    </div>
  );
}
