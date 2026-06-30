import { BookOpen, Target } from "lucide-react";
import { mockupTags, studyProgress } from "../data";
import LandingBadge from "../components/LandingBadge";

function HeroStudyMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[580px] rounded-md border border-grey-25 bg-white p-3 shadow-panel dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-3 flex flex-col gap-3 border-b border-grey-25 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary text-white dark:bg-dark-accent dark:text-[#16110a]">
            <BookOpen size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Study workspace
            </p>
            <h2 className="truncate text-h5 font-bold text-grey-200 poppins-font">
              Cloud Certification Exam Prep
            </h2>
          </div>
        </div>
        <LandingBadge variant="primary">Ready</LandingBadge>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-sm border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-bg">
          <div className="mb-4 flex flex-wrap gap-2">
            {mockupTags.map((tag) => (
              <LandingBadge key={tag}>{tag}</LandingBadge>
            ))}
          </div>
          <h3 className="text-h4 font-bold leading-tight text-grey-200 poppins-font">
            Learn cloud fundamentals with guided notes, active recall, and timed review.
          </h3>
          <div className="mt-5 space-y-3">
            {studyProgress.map((step) => (
              <div key={step.label}>
                <div className="mb-2 flex items-center justify-between text-h6 inter-font">
                  <span className="font-semibold text-grey-200">{step.label}</span>
                  <span className="text-p-text-darker">{step.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-dark-surface-soft">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-350 ease-smooth",
                      step.active ? "bg-primary" : "bg-grey-25",
                    ].join(" ")}
                    style={{ width: step.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-sm border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface-soft dark:shadow-none">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Target size={18} aria-hidden="true" />
              <p className="text-h6 font-semibold uppercase poppins-font">
                Next step
              </p>
            </div>
            <p className="text-h5 leading-6 text-grey-200 inter-font">
              Review identity access, then take a 20-minute practice set.
            </p>
          </div>
          <div className="rounded-sm border border-grey-25 bg-accent-100 p-4 dark:border-primary-200/40 dark:bg-dark-surface-soft">
            <div className="flex items-center justify-between gap-3">
              <span className="text-h6 font-semibold text-p-text-darker inter-font">
                Latest score
              </span>
              <span className="text-h3 font-bold text-primary-200 poppins-font">
                82%
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <LandingBadge>IAM</LandingBadge>
              <LandingBadge>Networking</LandingBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroStudyMockup;
