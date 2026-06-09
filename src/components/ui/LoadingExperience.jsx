"use client";

import { BookOpen, Sparkles } from "lucide-react";

const sizeClasses = {
  page: "min-h-screen",
  panel: "min-h-[360px]",
  compact: "min-h-[220px]",
};

function LoadingExperience({
  title = "Preparing your workspace",
  message = "Gathering your study materials and progress.",
  variant = "page",
  showSkeleton = true,
}) {
  return (
    <div
      className={[
        "flex w-full items-center justify-center bg-off-white-100 px-4 py-10 dark:bg-dark-bg",
        sizeClasses[variant] || sizeClasses.page,
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-[720px]">
        <div className="rounded-md border border-grey-25 bg-white p-5 shadow-panel dark:border-dark-border dark:bg-dark-surface dark:shadow-none sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-md border border-primary/25 bg-accent-100 dark:border-primary-25/30 dark:bg-dark-surface-soft" />
              <div className="absolute inset-2 rounded-md border border-primary/40 aurify-loader-spin" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white shadow-btn-primary dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none">
                <BookOpen size={20} aria-hidden="true" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2 text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
                <Sparkles size={14} aria-hidden="true" />
                Aurify is loading
              </div>
              <h1 className="break-words text-h3 font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
                {title}
              </h1>
              <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft">
            <div className="h-full w-1/2 rounded-full bg-primary aurify-loader-slide dark:bg-dark-accent" />
          </div>

          {showSkeleton ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-surface-soft"
                >
                  <div className="h-3 w-20 rounded-full bg-grey-25 aurify-skeleton dark:bg-dark-border" />
                  <div className="mt-4 h-5 w-28 rounded-full bg-grey-25 aurify-skeleton dark:bg-dark-border" />
                  <div className="mt-3 h-2 w-full rounded-full bg-grey-25 aurify-skeleton dark:bg-dark-border" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default LoadingExperience;
