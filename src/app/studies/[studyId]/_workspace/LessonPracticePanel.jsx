import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Badge, Button } from "@/components/ui";

export function LessonPracticePanel({
  question,
  selectedAnswer,
  feedback,
  loading,
  submitting,
  error,
  onSelectAnswer,
  onSubmit,
}) {
  if (loading) {
    return (
      <div className="mt-6 rounded-md border border-primary/25 bg-accent-25 p-4 dark:border-primary-25/30 dark:bg-dark-surface-soft">
        <p className="text-h5 font-semibold text-primary-200 inter-font dark:text-primary-25">
          Preparing lesson practice...
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mt-6 rounded-md border border-error/30 bg-error-light p-4 dark:bg-error/15">
        <div className="flex gap-2 text-error dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-h5 leading-6 inter-font">
            Lesson practice is not available for this lesson yet.
          </p>
        </div>
      </div>
    );
  }

  const isComplete = Boolean(feedback);
  const isCorrect = Boolean(feedback?.is_correct);

  return (
    <div className="mt-6 rounded-md border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-surface-soft sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
            Lesson practice
          </p>
          <h2 className="mt-1 text-h4 font-semibold leading-7 text-grey-200 poppins-font dark:text-dark-text">
            {question.question}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {question.difficulty ? <Badge variant="accent">{question.difficulty}</Badge> : null}
          {question.weak_area ? <Badge variant="neutral">{question.weak_area}</Badge> : null}
        </div>
      </div>

      <div className="grid gap-2">
        {(question.options || []).map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = feedback?.correct_answer === option;
          const isWrongSelection = isComplete && isSelected && !isCorrectOption;

          return (
            <button
              key={option}
              type="button"
              disabled={isComplete || submitting}
              onClick={() => onSelectAnswer(option)}
              className={[
                "flex w-full items-start justify-between gap-3 rounded-sm border px-3 py-3 text-left text-h5 leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
                isSelected && !isComplete
                  ? "border-primary bg-white text-primary-200 dark:border-primary-25 dark:bg-dark-surface dark:text-primary-25"
                  : "",
                !isSelected && !isComplete
                  ? "border-grey-25 bg-white text-p-text-darker hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted dark:hover:border-primary-25 dark:hover:text-primary-25"
                  : "",
                isCorrectOption && isComplete
                  ? "border-success bg-success-light text-success dark:border-success/40 dark:bg-success/15 dark:text-green-300"
                  : "",
                isWrongSelection
                  ? "border-error bg-error-light text-error dark:border-error/40 dark:bg-error/15 dark:text-red-300"
                  : "",
                isComplete && !isCorrectOption && !isWrongSelection
                  ? "border-grey-25 bg-white text-p-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span>{option}</span>
              {isCorrectOption && isComplete ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : null}
              {isWrongSelection ? (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-error/30 bg-error-light px-3 py-2 text-error dark:bg-error/15 dark:text-red-300">
          <p className="text-h6 leading-5 inter-font">{error}</p>
        </div>
      ) : null}

      {feedback ? (
        <div
          className={[
            "mt-4 rounded-md border p-4",
            isCorrect
              ? "border-success/30 bg-success-light text-success dark:bg-success/15 dark:text-green-300"
              : "border-error/30 bg-error-light text-error dark:bg-error/15 dark:text-red-300",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <p className="text-h5 font-semibold inter-font">
              {isCorrect ? "Correct" : "Incorrect"}
            </p>
          </div>
          <div className="mt-3 grid gap-2 text-h5 leading-6 inter-font">
            <p>
              <span className="font-semibold">Selected answer:</span>{" "}
              {feedback.selected_answer || selectedAnswer}
            </p>
            <p>
              <span className="font-semibold">Correct answer:</span>{" "}
              {feedback.correct_answer}
            </p>
            {feedback.explanation ? (
              <p>
                <span className="font-semibold">Explanation:</span>{" "}
                {feedback.explanation}
              </p>
            ) : null}
            {feedback.weak_area ? (
              <p>
                <span className="font-semibold">Weak area:</span>{" "}
                {feedback.weak_area}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            size="md"
            loading={submitting}
            disabled={!selectedAnswer}
            onClick={onSubmit}
          >
            Submit answer
          </Button>
        </div>
      )}
    </div>
  );
}
