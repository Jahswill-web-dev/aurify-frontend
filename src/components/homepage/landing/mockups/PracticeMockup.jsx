import LandingBadge from "../components/LandingBadge";

const answers = [
  "Reread every note from the beginning",
  "Use active recall before checking notes",
  "Skip weak topics until the final day",
];

function PracticeMockup() {
  return (
    <div className="h-full rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Practice
          </p>
          <h3 className="text-h4 font-bold text-grey-200 poppins-font">
            Test understanding as you learn
          </h3>
        </div>
        <LandingBadge>Question 4</LandingBadge>
      </div>
      <p className="text-h5 font-semibold leading-6 text-grey-200 inter-font">
        What is the strongest way to prepare for a closed-book exam?
      </p>
      <div className="mt-4 grid gap-2">
        {answers.map((answer, index) => (
          <div
            key={answer}
            className={[
              "flex items-center gap-3 rounded-sm border px-3 py-3 text-h5 inter-font",
              index === 1
                ? "border-primary bg-accent-100 text-primary-200 dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                : "border-grey-25 bg-off-white-100 text-p-text-darker dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted",
            ].join(" ")}
          >
            <span
              className={[
                "h-4 w-4 shrink-0 rounded-full border",
                index === 1 ? "border-primary bg-primary" : "border-grey-100",
              ].join(" ")}
            />
            {answer}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PracticeMockup;
