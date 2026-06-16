import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { latestSetId, practiceReadyStatuses } from "./constants";
import { PracticeLoadingState, PracticeResultSummary, PracticeUnavailableState, QuestionNumberGrid, QuestionSetLanding, SessionHeader } from "./QuestionSession";

export function PracticeTab({
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
  onAnswer,
  onActiveIndexChange,
  onSubmit,
  onReset,
}) {
  if (!practiceReadyStatuses.has(study.status)) {
    return (
      <PracticeUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  if (loading) return <PracticeLoadingState />;

  if (activeView === "sets") {
    return (
      <QuestionSetLanding
        mode="practice"
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
      <PracticeUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  const safeActiveIndex = Math.min(activeIndex, questions.length - 1);
  const question = questions[safeActiveIndex];
  const selectedAnswer = answers[question.id];
  const correctAnswer = question.correct_answer || question.correctAnswer || question.answer;
  const hasAnswered = Boolean(selectedAnswer);
  const isCorrect = hasAnswered && selectedAnswer === correctAnswer;
  const answeredCount = Object.keys(answers).filter((questionId) =>
    questions.some((item) => item.id === questionId)
  ).length;
  const allAnswered = answeredCount === questions.length;
  const selectedSet = questionSets.find((set) => set.id === selectedSetId);
  const sessionTitle =
    selectedSet?.title || (selectedSetId === latestSetId ? "Latest Practice" : "Practice Set");

  return (
    <div className="grid gap-5">
      <SessionHeader
        mode="practice"
        title={sessionTitle}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onBack={onBackToSets}
      />

      <QuestionNumberGrid
        questions={questions}
        answers={answers}
        activeIndex={safeActiveIndex}
        onActiveIndexChange={onActiveIndexChange}
        variant="practice"
      />

      <div className="grid gap-5">
        <PracticeResultSummary result={attemptResult} onReset={onReset} />

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
            const isCorrectOption = option === correctAnswer;
            const showCorrect = hasAnswered && isCorrectOption;
            const showIncorrect = hasAnswered && isSelected && !isCorrectOption;

            return (
              <button
                key={option}
                type="button"
                disabled={hasAnswered}
                onClick={() => onAnswer(question.id, option)}
                className={[
                  "flex min-h-[52px] w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-h5 leading-6 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-default inter-font dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
                  showCorrect
                    ? "border-success bg-success-light text-success dark:bg-success/15 dark:text-green-300"
                    : showIncorrect
                      ? "border-error bg-error-light text-error dark:bg-error/15 dark:text-red-300"
                      : isSelected
                        ? "border-primary bg-accent-25 text-primary dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                        : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:bg-dark-bg dark:hover:text-primary-25",
                ].join(" ")}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  {showCorrect ? (
                    <CheckCircle2 size={18} aria-hidden="true" />
                  ) : showIncorrect ? (
                    <XCircle size={18} aria-hidden="true" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-current" />
                  )}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {hasAnswered ? (
          <div
            className={[
              "mt-5 rounded-md border px-4 py-3",
              isCorrect
                ? "border-success bg-success-light text-success"
                : "border-error bg-error-light text-error",
            ].join(" ")}
          >
            <p className="text-h5 font-semibold inter-font">
              {isCorrect ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1 text-h5 leading-7 inter-font">
              {question.explanation || `Correct answer: ${correctAnswer}`}
            </p>
          </div>
        ) : null}

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
            disabled={!allAnswered}
            loading={submitLoading}
            onClick={onSubmit}
          >
            Submit Practice
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}
