import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Circle, LayoutDashboard, Loader2, RefreshCw } from "lucide-react";
import { Badge, Button, Card, LoadingExperience } from "@/components/ui";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getGenerationFailureMessage } from "@/app/lib/aurifyApi";
import { generationSteps, statusConfig, visibleGenerationStatuses } from "./constants";
import { clamp, getActiveGenerationStep, getGenerationStepState, getNextGenerationStep, getTitle } from "./helpers";

export function ProgressBar({ value, className = "" }) {
  return (
    <div className={["h-2 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft", className].join(" ")}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-350 ease-smooth dark:bg-dark-accent"
        style={{ width: `${clamp(value)}%` }}
      />
    </div>
  );
}

export function WorkspaceHeader({ study, progress }) {
  const status = statusConfig[study?.status] || statusConfig.queued;

  return (
    <header className="border-b border-grey-25 bg-white px-4 py-4 sm:px-6 lg:px-8 dark:border-dark-border dark:bg-dark-surface">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/studies"
            className="inline-flex items-center gap-2 text-h6 font-medium text-p-text transition-colors hover:text-primary dark:text-dark-muted dark:hover:text-primary-25"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Studies
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center gap-2 rounded-sm border border-grey-25 bg-off-white-100 px-3 text-h6 font-medium text-p-text-darker transition-colors hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:text-primary-25"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-xl-head font-bold leading-tight text-grey-200 poppins-font">
              {getTitle(study)}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{study?.subject || "General"}</Badge>
              {study?.level ? <Badge variant="neutral">{study.level}</Badge> : null}
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>

          <div className="w-full max-w-[360px]">
            <div className="mb-2 flex items-center justify-between text-h6 inter-font">
              <span className="text-p-text">Study progress</span>
              <span className="font-semibold text-grey-200">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>
    </header>
  );
}

export function LoadingState() {
  return (
    <LoadingExperience
      title="Loading this Study"
      message="Preparing your material, question sets, and progress."
    />
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-10 dark:bg-dark-bg">
      <Card variant="default" className="mx-auto max-w-[640px] p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-error" aria-hidden="true" />
        <h1 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Study could not load
        </h1>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          {message}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="md" onClick={onRetry}>
            Retry
          </Button>
          <Link
            href="/studies"
            className="inline-flex items-center justify-center rounded-sm border border-primary px-4 py-2 text-h5 font-medium text-primary transition-colors hover:bg-accent-25 dark:border-primary-25 dark:text-primary-25 dark:hover:bg-dark-surface-soft"
          >
            Back to Studies
          </Link>
        </div>
      </Card>
    </main>
  );
}

export function GenerationNotice({ study, polling, onResume, resumeLoading }) {
  if (
    study.status === "failed" ||
    study.status === "modules_failed" ||
    study.status === "module_partial_ready"
  ) {
    const isPartial = study.status === "module_partial_ready";
    const title = isPartial
      ? "Some modules need attention"
      : "Generation stopped";
    const message = isPartial
      ? "Aurify saved the modules that finished successfully. Resume generation to retry the unfinished module tasks."
      : study.generation_error || getGenerationFailureMessage(study);

    return (
      <Card variant="default" className="mb-5 border-error bg-error-light p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
            <div>
              <h2 className="text-h4 font-semibold text-grey-200 poppins-font">
                {title}
              </h2>
              <p className="mt-1 text-h5 leading-7 text-p-text-darker inter-font">
                {message}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            loading={resumeLoading}
            onClick={onResume}
            className="shrink-0"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Resume
          </Button>
        </div>
      </Card>
    );
  }

  if (!visibleGenerationStatuses.has(study.status) || study.status === "exam_ready") {
    return null;
  }

  const activeStep = getActiveGenerationStep(study.status);
  const nextStep = activeStep ? null : getNextGenerationStep(study.status);
  const completedCount = generationSteps.filter(
    (step, index) => getGenerationStepState(study.status, step, index) === "done"
  ).length;
  const primaryLabel =
    activeStep?.activeLabel ||
    (nextStep ? `${nextStep.title} is up next` : "Finishing your Study");
  const helperLabel = activeStep
    ? "Aurify is working through this step now."
    : "The previous step is ready. Aurify will continue when the next generation step starts.";

  return (
    <Card
      variant="default"
      className="mb-5 overflow-hidden border-primary/30 bg-white p-0 shadow-panel dark:border-primary-25/30 dark:bg-dark-surface"
    >
      <div className="border-b border-grey-25 bg-off-white-100 px-5 py-4 dark:border-dark-border dark:bg-dark-surface-soft sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-accent-100 text-primary dark:border-primary-25/30 dark:bg-dark-surface dark:text-primary-25">
              {activeStep ? (
                <Loader2 className="h-5 w-5 aurify-loader-spin" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
                  Building your Study
                </p>
                <Badge variant="accent">
                  {completedCount}/{generationSteps.length} done
                </Badge>
              </div>
              <h2 className="break-words text-h4 font-semibold leading-7 text-grey-200 poppins-font dark:text-dark-text">
                {primaryLabel}
              </h2>
              <p className="mt-1 text-h5 leading-6 text-p-text-darker inter-font dark:text-dark-muted">
                {helperLabel}
              </p>
            </div>
          </div>
          <Badge variant={polling ? "accent" : "neutral"}>
            {polling ? "Live update" : "Ready"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-2 p-4 sm:p-5" role="list" aria-label="Study generation progress">
        {generationSteps.map((step, index) => {
          const state = getGenerationStepState(study.status, step, index);
          const isDone = state === "done";
          const isActive = state === "active";
          const label = isDone
            ? step.doneLabel
            : isActive
              ? step.activeLabel
              : step.waitingLabel;

          return (
            <div
              key={step.id}
              role="listitem"
              className={[
                "flex items-start gap-3 rounded-md border px-3 py-3 transition-all duration-250 ease-smooth",
                isDone
                  ? "border-success/25 bg-success-light/70 dark:border-success/30 dark:bg-success/10"
                  : "",
                isActive
                  ? "border-primary/40 bg-accent-25 shadow-card dark:border-primary-25/40 dark:bg-dark-surface-soft"
                  : "",
                !isDone && !isActive
                  ? "border-grey-25 bg-white dark:border-dark-border dark:bg-dark-surface"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={[
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  isDone
                    ? "border-success bg-success text-white"
                    : "",
                  isActive
                    ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                    : "",
                  !isDone && !isActive
                    ? "border-grey-25 bg-off-white-100 text-grey-100 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isDone ? (
                  <CheckCircle2 size={15} aria-hidden="true" />
                ) : isActive ? (
                  <Loader2 size={15} className="aurify-loader-spin" aria-hidden="true" />
                ) : (
                  <Circle size={10} aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={[
                      "break-words text-h5 font-semibold leading-6 inter-font",
                      isDone
                        ? "text-grey-200 dark:text-dark-text"
                        : isActive
                          ? "text-primary-200 dark:text-primary-25"
                          : "text-p-text dark:text-dark-muted",
                    ].join(" ")}
                  >
                    {label}
                  </p>
                  <span
                    className={[
                      "shrink-0 text-h6 font-semibold uppercase inter-font",
                      isDone
                        ? "text-success"
                        : isActive
                          ? "text-primary dark:text-primary-25"
                          : "text-grey-100 dark:text-dark-muted",
                    ].join(" ")}
                  >
                    {isDone ? "Done" : isActive ? "Generating" : index === completedCount ? "Up next" : "Queued"}
                  </span>
                </div>
                {isActive ? (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-bg">
                    <div className="h-full w-1/2 rounded-full bg-primary aurify-loader-slide dark:bg-dark-accent" />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function Metric({ icon: Icon, label, value }) {
  return (
    <Card variant="default">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent-100 text-primary">
        <Icon size={20} aria-hidden="true" />
      </div>
      <p className="text-h3 font-bold text-grey-200 poppins-font">{value}</p>
      <p className="mt-1 text-h6 text-p-text inter-font">{label}</p>
    </Card>
  );
}
