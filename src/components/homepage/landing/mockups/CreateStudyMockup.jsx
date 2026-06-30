import { Sparkles } from "lucide-react";
import LandingBadge from "../components/LandingBadge";

function CreateStudyMockup() {
  return (
    <div className="h-full rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Prompt to Study
          </p>
          <h3 className="text-h4 font-bold text-grey-200 poppins-font">
            Create a path from one goal
          </h3>
        </div>
      </div>
      <div className="rounded-sm border border-grey-25 bg-off-white-100 p-4 text-h5 leading-7 text-p-text-darker inter-font dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted">
        Help me prepare for my nursing pharmacology exam. Cover drug classes,
        side effects, dosage safety, and practice questions.
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <LandingBadge variant="primary">University</LandingBadge>
        <LandingBadge>Exam prep</LandingBadge>
        <LandingBadge>Intermediate</LandingBadge>
      </div>
    </div>
  );
}

export default CreateStudyMockup;
