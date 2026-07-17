import { AlertCircle, CheckCircle2, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export function RevisionCheckpointStatus({ checkpoint, onRetry, onSkip }) {
  if (!checkpoint.lessonsComplete) {
    return (
      <div className="rounded-md border border-grey-25 bg-off-white-100 p-5 dark:border-dark-border dark:bg-dark-surface-soft">
        <p className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
          Finish the lessons first
        </p>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
          This required checkpoint unlocks after every lesson in the module group is complete.
        </p>
      </div>
    );
  }

  if (checkpoint.loading || checkpoint.isGenerating) {
    return (
      <div className="rounded-md border border-primary/25 bg-accent-25 p-5 dark:border-primary-25/30 dark:bg-dark-surface-soft">
        <div className="flex items-center gap-3 text-primary-200 dark:text-primary-25">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <div>
            <p className="text-h4 font-semibold poppins-font">Preparing targeted revision</p>
            <p className="mt-1 text-h5 inter-font">Aurify is building questions from your weak areas.</p>
          </div>
        </div>
      </div>
    );
  }

  if (checkpoint.hasFailed && !checkpoint.skipped) {
    return (
      <div className="rounded-md border border-error/30 bg-error-light p-5 dark:bg-error/15">
        <div className="flex gap-3 text-error dark:text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-h4 font-semibold poppins-font">Revision generation stopped</p>
            <p className="mt-1 text-h5 leading-7 inter-font">
              {checkpoint.automaticRetriesExhausted
                ? "Automatic recovery reached its limit. Retry this lesson revision manually before continuing."
                : "Retry the failed lesson revision before continuing."}
            </p>
            {checkpoint.retryCount ? (
              <p className="mt-2 text-h6 leading-5 inter-font">
                Automatic retries: {Math.min(checkpoint.retryCount, 3)} of 3
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" size="md" loading={checkpoint.retrying} onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            Retry generation
          </Button>
          {checkpoint.retryAttempted ? (
            <Button variant="ghost" size="md" onClick={onSkip}>Continue without revision</Button>
          ) : null}
        </div>
        {checkpoint.error ? <p className="mt-3 text-h6 inter-font">{checkpoint.error}</p> : null}
      </div>
    );
  }

  if (checkpoint.empty || checkpoint.skipped) {
    return (
      <div className="rounded-md border border-success/30 bg-success-light p-5 text-success dark:bg-success/15 dark:text-green-300">
        <div className="flex items-center gap-3">
          {checkpoint.skipped ? (
            <CheckCircle2 className="h-6 w-6 shrink-0" aria-hidden="true" />
          ) : (
            <Sparkles className="h-6 w-6 shrink-0" aria-hidden="true" />
          )}
          <div>
            <p className="text-h3 font-semibold poppins-font">
              {checkpoint.skipped ? "Checkpoint skipped" : "No weak areas found"}
            </p>
            <p className="mt-1 text-h5 leading-7 inter-font">
              {checkpoint.skipped
                ? "You can continue because revision generation could not recover."
                : "You completed this module group without needing targeted revision."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (checkpoint.error && !checkpoint.questions.length) {
    return (
      <div className="rounded-md border border-error/30 bg-error-light p-5 text-error dark:bg-error/15 dark:text-red-300">
        <p className="text-h4 font-semibold poppins-font">Could not load revision</p>
        <p className="mt-2 text-h5 inter-font">{checkpoint.error}</p>
        <Button variant="ghost" size="md" className="mt-4" onClick={onRetry}>Try again</Button>
      </div>
    );
  }

  return null;
}
