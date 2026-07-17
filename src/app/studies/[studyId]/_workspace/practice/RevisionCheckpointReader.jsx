import { CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { PracticeQuestion } from "./PracticeQuestion";
import { RevisionCheckpointStatus } from "./RevisionCheckpointStatus";

export function RevisionCheckpointReader({
  checkpoint,
  onSelectAnswer,
  onSubmit,
  onAdvance,
  onRetry,
  onSkip,
  onContinue,
}) {
  if (!checkpoint) return null;
  const question = checkpoint.currentQuestion;
  const resolved = checkpoint.resolved;
  const total = checkpoint.questions.length;
  const answered = checkpoint.answeredQuestionIds?.length || checkpoint.answeredCount || 0;

  return (
    <article className="mx-auto max-w-[900px]">
      <Card variant="default" className="p-5 sm:p-7">
        <div className="mb-6 border-b border-grey-25 pb-5 dark:border-dark-border">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="accent">Required checkpoint</Badge>
            {checkpoint.modules.map((module) => (
              <Badge key={module.id || module.module_number} variant="neutral">
                Module {module.module_number}
              </Badge>
            ))}
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="mt-1 h-6 w-6 shrink-0 text-primary dark:text-primary-25" aria-hidden="true" />
            <div>
              <h1 className="text-xl-head font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
                {checkpoint.title}
              </h1>
              <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                Strengthen the concepts you missed before moving to the next module group.
              </p>
            </div>
          </div>
        </div>

        <RevisionCheckpointStatus checkpoint={checkpoint} onRetry={onRetry} onSkip={onSkip} />

        {!resolved && question && !checkpoint.isGenerating && !checkpoint.hasFailed ? (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral">Question {Math.min(answered + 1, total)} of {total}</Badge>
                <Badge variant="neutral">From module {question.sourceModuleNumber}</Badge>
              </div>
              <span className="text-h6 text-p-text-darker inter-font dark:text-dark-muted">
                {question.sourceLessonTitle}
              </span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft">
              <div
                className="h-full rounded-full bg-primary transition-all duration-350 dark:bg-dark-accent"
                style={{ width: `${total ? Math.min((answered / total) * 100, 100) : 0}%` }}
              />
            </div>
            <PracticeQuestion
              question={question}
              selectedAnswer={checkpoint.selectedAnswer || ""}
              feedback={checkpoint.feedback}
              submitting={checkpoint.submitting}
              error={checkpoint.error}
              onSelectAnswer={onSelectAnswer}
              onSubmit={onSubmit}
            />
            {checkpoint.feedback ? (
              <div className="mt-5 flex justify-end border-t border-grey-25 pt-4 dark:border-dark-border">
                <Button variant="primary" size="md" onClick={onAdvance}>
                  Next question
                  <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </>
        ) : null}

        {checkpoint.completed ? (
          <div className="rounded-md border border-success/30 bg-success-light p-5 text-success dark:bg-success/15 dark:text-green-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <p className="text-h3 font-semibold poppins-font">Revision complete</p>
            </div>
            <p className="mt-2 text-h5 inter-font">
              You answered {checkpoint.correctCount} of {checkpoint.questions.length} correctly.
            </p>
          </div>
        ) : null}

        {resolved && onContinue ? (
          <div className="mt-5 flex justify-end border-t border-grey-25 pt-4 dark:border-dark-border">
            <Button variant="primary" size="md" onClick={onContinue}>
              Continue learning
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </Card>
    </article>
  );
}
