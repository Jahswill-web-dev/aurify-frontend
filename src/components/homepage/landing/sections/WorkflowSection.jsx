import { ListChecks } from "lucide-react";
import { workflowSteps } from "../data";
import MotionSection from "../components/MotionSection";
import SectionHeading from "../components/SectionHeading";

function WorkflowSection() {
  return (
    <MotionSection className="py-16">
      <SectionHeading
        eyebrow="A clearer study loop"
        icon={ListChecks}
        title="Create a Study, work through it, then test what stuck."
        description="Aurify keeps the study flow simple: define the goal, learn the material, and prove your progress with practice."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="rounded-md border border-grey-25 bg-white p-5 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <span className="text-h2 font-bold text-accent-200 poppins-font dark:text-dark-border">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-h4 font-bold text-grey-200 poppins-font">
                {step.title}
              </h3>
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>
    </MotionSection>
  );
}

export default WorkflowSection;
