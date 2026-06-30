import { LineChart, PlayCircle } from "lucide-react";
import LandingBadge from "../components/LandingBadge";

function ExamAnalyticsMockup() {
  return (
    <div className="h-full rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-bg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-primary">
              <PlayCircle size={18} aria-hidden="true" />
              <span className="text-h6 font-semibold uppercase poppins-font">
                Exam mode
              </span>
            </div>
            <LandingBadge>20:00</LandingBadge>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className={[
                  "flex aspect-square items-center justify-center rounded-sm border text-h6 font-bold",
                  index < 7
                    ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                    : "border-grey-25 bg-white text-p-text dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted",
                ].join(" ")}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-grey-25 bg-accent-100 p-4 dark:border-primary-200/40 dark:bg-dark-surface-soft">
          <div className="mb-4 flex items-center gap-2 text-primary-200">
            <LineChart size={18} aria-hidden="true" />
            <span className="text-h6 font-semibold uppercase poppins-font">
              Analytics
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-2 flex justify-between gap-3 text-h6 inter-font">
                <span className="font-semibold text-grey-200">Overall progress</span>
                <span className="text-p-text-darker">74%</span>
              </div>
              <div className="h-2 rounded-full bg-white dark:bg-dark-surface">
                <div className="h-full w-[74%] rounded-full bg-primary dark:bg-dark-accent" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <LandingBadge>Weak: formulas</LandingBadge>
              <LandingBadge>Review: timing</LandingBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamAnalyticsMockup;
